import { ref } from 'vue'

export const pendingRequests = ref(0)

const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function buildUrl(path) {
  if (!apiBaseUrl) return path
  return `${apiBaseUrl}${path}`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const RETRY_CONFIG = {
  retries: Number(import.meta.env.VITE_RETRY_RETRIES ?? 3),
  backoff: Number(import.meta.env.VITE_RETRY_BACKOFF_MS ?? 800),
  timeout: Number(import.meta.env.VITE_RETRY_TIMEOUT_MS ?? 10000),
}

// GET es idempotente: se puede reintentar. POST/PUT/DELETE tienen side effects: no.
function isIdempotent(method = 'GET') {
  return method.toUpperCase() === 'GET'
}

// Reintenta solo en errores de red o 5xx. Los 4xx (auth, validación) fallan de inmediato.
function isRetryable(error) {
  return error instanceof TypeError || error.status >= 500
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), RETRY_CONFIG.timeout)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function request(url, options = {}) {
  const isFormData = options.body instanceof FormData
  const fetchOptions = {
    credentials: 'include',
    headers: isFormData
      ? { ...(options.headers || {}) }
      : { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  }

  const maxAttempts = isIdempotent(options.method) ? RETRY_CONFIG.retries + 1 : 1
  const isSilent = options.silent === true

  if (!isSilent) pendingRequests.value++
  let lastError
  try {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_CONFIG.backoff * Math.pow(2, attempt - 1)) // 800ms, 1600ms, 3200ms
    }

    try {
      const response = await fetchWithTimeout(buildUrl(url), fetchOptions)
      const contentType = response.headers.get('content-type') || ''
      const payload = contentType.includes('application/json') ? await response.json() : null

      if (!response.ok) {
        const err = new Error(payload?.error || 'Ocurrió un error inesperado.')
        err.status = response.status
        if (!isRetryable(err)) throw err
        lastError = err
        continue
      }

      return payload
    } catch (error) {
      if (error.name === 'AbortError') {
        error.message = 'La solicitud tardó demasiado. Intenta de nuevo.'
      }
      if (!isRetryable(error)) throw error
      lastError = error
    }
  }

  throw lastError
  } finally {
    if (!isSilent) pendingRequests.value--
  }
}

export function getPublicSite() {
  return request('/api/public/site', { silent: true })
}

export function submitContact(contact) {
  return request('/api/public/contacts', { method: 'POST', body: JSON.stringify(contact) })
}

export function login(credentials) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' })
}

export function getSession() {
  return request('/api/auth/me')
}

export function getAdminSite() {
  return request('/api/admin/site')
}

export function getAdminContacts({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
  return request(`/api/admin/contacts?${params.toString()}`)
}

export function getAdminPosts({ page = 1, pageSize = 10, type = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })

  if (type) {
    params.set('type', type)
  }

  return request(`/api/admin/posts?${params.toString()}`)
}

export function getAdminPost(id) {
  return request(`/api/admin/posts/${id}`)
}

export function saveSection(key, value) {
  return request(`/api/admin/site/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  })
}

export function createAdminPost(post) {
  return request('/api/admin/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  })
}

export function updateAdminPost(id, post) {
  return request(`/api/admin/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  })
}

export function deleteAdminPost(id) {
  return request(`/api/admin/posts/${id}`, {
    method: 'DELETE',
  })
}

export function uploadAdminImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request('/api/admin/uploads', {
    method: 'POST',
    body: formData,
  })
}

export function getAdminMedia() {
  return request('/api/admin/media')
}

export function deleteAdminMedia(id) {
  return request(`/api/admin/media/${id}`, { method: 'DELETE' })
}

export function getAdminSiteHistory(key) {
  return request(`/api/admin/site/${key}/history`)
}

export function restoreAdminSiteHistory(id) {
  return request(`/api/admin/site/history/${id}/restore`, { method: 'POST' })
}
