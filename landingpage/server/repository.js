import { db } from './db.js'
import {
  cloneDefaultPosts,
  cloneDefaultSiteData,
  defaultPosts,
  defaultSiteData,
  editableSectionKeys,
} from '../src/content/defaultSiteData.js'

const DEFAULT_SETTINGS = cloneDefaultSiteData()
const DEFAULT_POSTS = cloneDefaultPosts()

export async function runMigrations() {
  const statements = [
    `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('news', 'event')),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        image_url TEXT DEFAULT '',
        location TEXT DEFAULT '',
        event_date TEXT DEFAULT '',
        published INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
  ]

  for (const sql of statements) {
    await db.execute(sql)
  }

  for (const key of editableSectionKeys) {
    await db.execute({
      sql: `
        INSERT INTO site_settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO NOTHING
      `,
      args: [key, JSON.stringify(DEFAULT_SETTINGS[key])],
    })
  }

  const existingPosts = await db.execute('SELECT COUNT(*) AS total FROM posts')
  const totalPosts = Number(existingPosts.rows[0]?.total || 0)

  if (!totalPosts) {
    for (const post of DEFAULT_POSTS) {
      await db.execute({
        sql: `
          INSERT INTO posts (
            type, title, slug, excerpt, content, image_url, location, event_date, published, sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          post.type,
          post.title,
          post.slug,
          post.excerpt,
          post.content,
          post.imageUrl,
          post.location,
          post.eventDate,
          post.published,
          post.sortOrder,
        ],
      })
    }
  }
}

export async function getSiteSettings() {
  const result = await db.execute('SELECT key, value FROM site_settings')
  const merged = cloneDefaultSiteData()

  for (const row of result.rows) {
    if (!editableSectionKeys.includes(row.key)) continue
    try {
      merged[row.key] = JSON.parse(row.value)
    } catch {
      merged[row.key] = defaultSiteData[row.key]
    }
  }

  return merged
}

export async function updateSiteSetting(key, value) {
  if (!editableSectionKeys.includes(key)) {
    throw new Error(`Section "${key}" is not editable.`)
  }

  await db.execute({
    sql: `
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [key, JSON.stringify(value)],
  })

  return value
}

export async function listPosts({ type, publishedOnly = false } = {}) {
  const clauses = []
  const args = []

  if (type) {
    clauses.push('type = ?')
    args.push(type)
  }

  if (publishedOnly) {
    clauses.push('published = 1')
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const result = await db.execute({
    sql: `
      SELECT
        id,
        type,
        title,
        slug,
        excerpt,
        content,
        image_url,
        location,
        event_date,
        published,
        sort_order,
        created_at,
        updated_at
      FROM posts
      ${where}
      ORDER BY sort_order ASC, event_date DESC, created_at DESC
    `,
    args,
  })

  return result.rows.map(mapPostRow)
}

export async function listPostsPage({ type, page = 1, pageSize = 10, publishedOnly = false } = {}) {
  const clauses = []
  const args = []
  const normalizedPage = Math.max(Number(page) || 1, 1)
  const normalizedPageSize = Math.min(Math.max(Number(pageSize) || 10, 1), 50)

  if (type) {
    clauses.push('type = ?')
    args.push(type)
  }

  if (publishedOnly) {
    clauses.push('published = 1')
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const countResult = await db.execute({
    sql: `SELECT COUNT(*) AS total FROM posts ${where}`,
    args,
  })
  const total = Number(countResult.rows[0]?.total || 0)
  const offset = (normalizedPage - 1) * normalizedPageSize
  const result = await db.execute({
    sql: `
      SELECT
        id,
        type,
        title,
        slug,
        excerpt,
        content,
        image_url,
        location,
        event_date,
        published,
        sort_order,
        created_at,
        updated_at
      FROM posts
      ${where}
      ORDER BY sort_order ASC, event_date DESC, created_at DESC
      LIMIT ? OFFSET ?
    `,
    args: [...args, normalizedPageSize, offset],
  })

  return {
    items: result.rows.map(mapPostRow),
    page: normalizedPage,
    pageSize: normalizedPageSize,
    total,
    totalPages: Math.max(Math.ceil(total / normalizedPageSize), 1),
  }
}

export async function getPostById(id) {
  const result = await db.execute({
    sql: `
      SELECT
        id,
        type,
        title,
        slug,
        excerpt,
        content,
        image_url,
        location,
        event_date,
        published,
        sort_order,
        created_at,
        updated_at
      FROM posts
      WHERE id = ?
      LIMIT 1
    `,
    args: [id],
  })

  return result.rows[0] ? mapPostRow(result.rows[0]) : null
}

export async function getPostBySlug(slug) {
  const result = await db.execute({
    sql: `
      SELECT
        id,
        type,
        title,
        slug,
        excerpt,
        content,
        image_url,
        location,
        event_date,
        published,
        sort_order,
        created_at,
        updated_at
      FROM posts
      WHERE slug = ?
      LIMIT 1
    `,
    args: [slug],
  })

  return result.rows[0] ? mapPostRow(result.rows[0]) : null
}

export async function createPost(post) {
  await db.execute({
    sql: `
      INSERT INTO posts (
        type,
        title,
        slug,
        excerpt,
        content,
        image_url,
        location,
        event_date,
        published,
        sort_order,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    args: [
      post.type,
      post.title,
      post.slug,
      post.excerpt,
      post.content,
      post.imageUrl,
      post.location,
      post.eventDate,
      Number(Boolean(post.published)),
      Number(post.sortOrder || 0),
    ],
  })

  return getPostBySlug(post.slug)
}

export async function updatePost(id, post) {
  await db.execute({
    sql: `
      UPDATE posts
      SET
        type = ?,
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        image_url = ?,
        location = ?,
        event_date = ?,
        published = ?,
        sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      post.type,
      post.title,
      post.slug,
      post.excerpt,
      post.content,
      post.imageUrl,
      post.location,
      post.eventDate,
      Number(Boolean(post.published)),
      Number(post.sortOrder || 0),
      id,
    ],
  })

  return getPostById(id)
}

export async function deletePost(id) {
  await db.execute({
    sql: 'DELETE FROM posts WHERE id = ?',
    args: [id],
  })
}

export async function listContacts({ page = 1, pageSize = 20 } = {}) {
  const offset = (page - 1) * pageSize
  const [rows, count] = await Promise.all([
    db.execute({
      sql: 'SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      args: [pageSize, offset],
    }),
    db.execute('SELECT COUNT(*) as total FROM contacts'),
  ])

  const total = Number(count.rows[0].total)
  return {
    items: rows.rows,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function createContact(contact) {
  await db.execute({
    sql: `
      INSERT INTO contacts (name, email, message)
      VALUES (?, ?, ?)
    `,
    args: [contact.name, contact.email, contact.message],
  })
}

export async function findUserByEmail(email) {
  const result = await db.execute({
    sql: 'SELECT id, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1',
    args: [email],
  })

  return result.rows[0] || null
}

export async function findUserById(id) {
  const result = await db.execute({
    sql: 'SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    args: [id],
  })

  return result.rows[0] || null
}

export async function createUser({ email, passwordHash, role = 'admin' }) {
  await db.execute({
    sql: `
      INSERT INTO users (email, password_hash, role)
      VALUES (?, ?, ?)
    `,
    args: [email, passwordHash, role],
  })

  return findUserByEmail(email)
}

export async function listUsers() {
  const result = await db.execute('SELECT id, email, role, created_at FROM users ORDER BY id ASC')
  return result.rows
}

export async function createSession({ userId, tokenHash, expiresAt }) {
  await db.execute({
    sql: `
      INSERT INTO sessions (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `,
    args: [userId, tokenHash, expiresAt.toISOString()],
  })
}

export async function findSession(tokenHash) {
  const result = await db.execute({
    sql: `
      SELECT
        sessions.id,
        sessions.user_id,
        sessions.expires_at,
        users.email,
        users.role
      FROM sessions
      INNER JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
      LIMIT 1
    `,
    args: [tokenHash],
  })

  return result.rows[0] || null
}

export async function deleteSession(tokenHash) {
  await db.execute({
    sql: 'DELETE FROM sessions WHERE token_hash = ?',
    args: [tokenHash],
  })
}

export async function purgeExpiredSessions() {
  await db.execute({
    sql: 'DELETE FROM sessions WHERE expires_at < ?',
    args: [new Date().toISOString()],
  })
}

function mapPostRow(row) {
  return {
    id: Number(row.id),
    type: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    imageUrl: row.image_url || '',
    location: row.location || '',
    eventDate: row.event_date || '',
    published: Number(row.published) === 1,
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
