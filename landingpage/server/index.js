import 'dotenv/config'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loginSchema, contactSchema, postSchema, validate } from './validators.js'
import {
  createSessionExpiryDate,
  createSessionToken,
  hashSessionToken,
  slugify,
  verifyPassword,
} from './auth.js'
import { databaseUrl } from './db.js'
import { isCloudinaryConfigured, uploadImageBuffer } from './cloudinary.js'
import {
  createContact,
  listContacts,
  createPost,
  createSession,
  deletePost,
  deleteSession,
  findSession,
  findUserByEmail,
  findUserById,
  getPostById,
  getSiteSettings,
  listPosts,
  listPostsPage,
  purgeExpiredSessions,
  runMigrations,
  updatePost,
  updateSiteSetting,
} from './repository.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')
const app = express()
const PORT = Number(process.env.PORT || 3001)
const SESSION_COOKIE = 'gc_admin_session'
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.VITE_FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean),
)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas peticiones, por favor intenta más tarde.' },
})

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login requests per hour
  message: { error: 'Demasiados intentos de inicio de sesión, intenta en una hora.' },
})

let publicSiteCache = null
let publicSiteCachePromise = null
let publicSiteCacheVersion = 0

app.use((request, response, next) => {
  const origin = request.headers.origin

  if (origin && allowedOrigins.has(origin)) {
    response.header('Access-Control-Allow-Origin', origin)
    response.header('Vary', 'Origin')
    response.header('Access-Control-Allow-Credentials', 'true')
    response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With',
    )
  }

  if (request.method === 'OPTIONS') {
    return response.sendStatus(204)
  }

  next()
})

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api/', limiter)

app.get('/api/health', async (_request, response) => {
  response.json({ ok: true, databaseUrl, cloudinaryConfigured: isCloudinaryConfigured })
})

app.get('/api/public/site', async (_request, response, next) => {
  try {
    const cacheStatus = publicSiteCache ? 'HIT' : 'MISS'

    if (!publicSiteCache) {
      if (!publicSiteCachePromise) {
        const requestVersion = publicSiteCacheVersion
        publicSiteCachePromise = buildPublicSitePayload()
          .then((payload) => {
            if (requestVersion === publicSiteCacheVersion) {
              publicSiteCache = payload
            }
            return payload
          })
          .finally(() => {
            publicSiteCachePromise = null
          })
      }

      await publicSiteCachePromise

      if (!publicSiteCache) {
        publicSiteCache = await buildPublicSitePayload()
      }
    }

    response.header('X-Cache', cacheStatus)
    response.json(publicSiteCache)
  } catch (error) {
    next(error)
  }
})

app.post('/api/public/contacts', async (request, response, next) => {
  try {
    const data = validate(contactSchema, request.body || {})
    await createContact(data)
    response.status(201).json({ ok: true })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', authLimiter, async (request, response, next) => {
  try {
    const data = validate(loginSchema, request.body || {})
    const email = data.email.toLowerCase().trim()
    const password = data.password

    const user = await findUserByEmail(email.toLowerCase().trim())
    if (!user) {
      return response.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return response.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const sessionToken = createSessionToken()
    const tokenHash = hashSessionToken(sessionToken)
    const expiresAt = createSessionExpiryDate()

    await purgeExpiredSessions()
    await createSession({
      userId: user.id,
      tokenHash,
      expiresAt,
    })

    const isProduction = process.env.NODE_ENV === 'production'
    response.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      expires: expiresAt,
      path: '/',
    })

    response.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/logout', async (request, response, next) => {
  try {
    const token = request.cookies[SESSION_COOKIE]
    if (token) {
      await deleteSession(hashSessionToken(token))
    }

    const isProduction = process.env.NODE_ENV === 'production'
    response.clearCookie(SESSION_COOKIE, {
      path: '/',
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    })
    response.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/me', async (request, response, next) => {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return response.status(401).json({ user: null })
    }

    response.json({ user })
  } catch (error) {
    next(error)
  }
})

app.get('/api/admin/site', requireAuth, async (_request, response, next) => {
  try {
    const settings = await getSiteSettings()
    response.json({ settings })
  } catch (error) {
    next(error)
  }
})

app.put('/api/admin/site/:key', requireAuth, async (request, response, next) => {
  try {
    const { key } = request.params
    const { value } = request.body || {}
    if (value === undefined) {
      return response.status(400).json({ error: 'Se requiere un valor para guardar.' })
    }

    const savedValue = await updateSiteSetting(key, value)
    invalidatePublicSiteCache()
    response.json({ key, value: savedValue })
  } catch (error) {
    next(error)
  }
})

app.get('/api/admin/contacts', requireAuth, async (request, response, next) => {
  try {
    const page = Number(request.query.page || 1)
    const pageSize = Number(request.query.pageSize || 20)
    const result = await listContacts({ page, pageSize })
    response.json(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/admin/posts', requireAuth, async (request, response, next) => {
  try {
    const type = ['event', 'news'].includes(request.query.type) ? request.query.type : ''
    const page = Number(request.query.page || 1)
    const pageSize = Number(request.query.pageSize || 10)
    const result = await listPostsPage({ type, page, pageSize })

    response.json(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/admin/posts/:id', requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id)
    const post = await getPostById(id)

    if (!post) {
      return response.status(404).json({ error: 'Publicación no encontrada.' })
    }

    response.json({ post })
  } catch (error) {
    next(error)
  }
})

app.post('/api/admin/posts', requireAuth, async (request, response, next) => {
  try {
    const post = validate(postSchema, request.body)
    if (!post.slug) post.slug = slugify(post.title)
    
    const createdPost = await createPost(post)
    invalidatePublicSiteCache()
    response.status(201).json({ post: createdPost })
  } catch (error) {
    next(error)
  }
})

app.put('/api/admin/posts/:id', requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id)
    const existing = await getPostById(id)
    if (!existing) {
      return response.status(404).json({ error: 'Publicación no encontrada.' })
    }

    const post = validate(postSchema, request.body)
    if (!post.slug) post.slug = slugify(post.title)
    
    const updated = await updatePost(id, post)
    invalidatePublicSiteCache()
    response.json({ post: updated })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/admin/posts/:id', requireAuth, async (request, response, next) => {
  try {
    const id = Number(request.params.id)
    await deletePost(id)
    invalidatePublicSiteCache()
    response.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

app.post(
  '/api/admin/uploads',
  requireAuth,
  upload.single('file'),
  async (request, response, next) => {
    try {
      if (!isCloudinaryConfigured) {
        return response.status(503).json({
          error: 'Cloudinary no está configurado en el servidor.',
        })
      }

      if (!request.file) {
        return response.status(400).json({ error: 'Debes seleccionar una imagen.' })
      }

      const result = await uploadImageBuffer(request.file.buffer, {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
      })

      response.status(201).json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    } catch (error) {
      next(error)
    }
  },
)

app.use(express.static(distDir))

app.get('/{*splat}', (request, response, next) => {
  if (request.path.startsWith('/api/')) return next()
  response.sendFile(path.join(distDir, 'index.html'))
})

app.use((error, _request, response, _next) => {
  console.error(error)
  const status = error.status || 500
  response.status(status).json({
    error: error.message || 'Ocurrió un error inesperado.',
  })
})

start()

async function start() {
  await runMigrations()
  app.listen(PORT, () => {
    console.log(`Backend ready on http://localhost:${PORT}`)
  })
}

async function buildPublicSitePayload() {
  const settings = await getSiteSettings()
  const posts = await listPosts({ publishedOnly: true })

  return {
    settings,
    posts: {
      news: posts.filter((post) => post.type === 'news'),
      events: posts.filter((post) => post.type === 'event'),
    },
    cachedAt: new Date().toISOString(),
  }
}

function invalidatePublicSiteCache() {
  publicSiteCache = null
  publicSiteCachePromise = null
  publicSiteCacheVersion += 1
}

async function requireAuth(request, response, next) {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return response.status(401).json({ error: 'Debes iniciar sesión.' })
  }

  request.user = user
  next()
}

async function getAuthenticatedUser(request) {
  const token = request.cookies[SESSION_COOKIE]
  if (!token) return null

  const session = await findSession(hashSessionToken(token))
  if (!session) return null

  const isExpired = new Date(session.expires_at).getTime() < Date.now()
  if (isExpired) {
    await deleteSession(hashSessionToken(token))
    return null
  }

  return findUserById(session.user_id)
}

// Removed normalizePostPayload as it is replaced by Zod
