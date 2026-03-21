const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const BLOGS_ENDPOINT = import.meta.env.VITE_BLOGS_ENDPOINT ?? '/api/blogs'
const GALLERY_ENDPOINT = import.meta.env.VITE_GALLERY_ENDPOINT ?? '/api/gallery'
const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT ?? '/api/auth/login'

function joinUrl(base, path) {
  if (!base) return path
  if (base.endsWith('/') && path.startsWith('/')) return base.slice(0, -1) + path
  if (!base.endsWith('/') && !path.startsWith('/')) return base + '/' + path
  return base + path
}

async function request(path, { method = 'GET', token, body, headers, isFormData } = {}) {
  const url = joinUrl(API_BASE_URL, path)
  const finalHeaders = { ...(headers ?? {}) }
  if (token) finalHeaders.Authorization = `Bearer ${token}`

  let finalBody = body
  if (body != null && !isFormData) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json'
    finalBody = JSON.stringify(body)
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : finalBody,
  })

  // Handle no-content responses (e.g. DELETE returning 204).
  if (res.status === 204) return null

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      payload?.errors?.[0]?.msg ||
      `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return payload
}

function unwrapData(payload) {
  if (payload == null) return payload
  if (payload.data != null) return payload.data
  if (payload.item != null) return payload.item
  if (payload.blog != null) return payload.blog
  if (payload.blogs != null) return payload.blogs
  if (payload.items != null) return payload.items
  if (payload.gallery != null) return payload.gallery
  return payload
}

export async function apiLogin({ email, password }) {
  const payload = await request(LOGIN_ENDPOINT, {
    method: 'POST',
    body: { email, password },
  })

  const nextToken = payload?.token ?? payload?.accessToken ?? payload?.jwt
  if (!nextToken) throw new Error('Login succeeded but token was not returned.')

  return { token: nextToken, payload }
}

export async function apiFetchBlogs(token) {
  const payload = await request(BLOGS_ENDPOINT, token ? { token } : undefined)
  const data = unwrapData(payload)
  return data
}

export async function apiFetchBlogById(id) {
  const payload = await request(`${BLOGS_ENDPOINT}/${id}`)
  return unwrapData(payload)
}

export async function apiCreateBlog({ title, description, date, content }, token) {
  const payload = await request(BLOGS_ENDPOINT, {
    method: 'POST',
    token,
    body: { title, description, date, content },
  })
  return unwrapData(payload)
}

export async function apiUpdateBlog(id, { title, description, date, content }, token) {
  const payload = await request(`${BLOGS_ENDPOINT}/${id}`, {
    method: 'PUT',
    token,
    body: { title, description, date, content },
  })
  return unwrapData(payload)
}

export async function apiDeleteBlog(id, token) {
  await request(`${BLOGS_ENDPOINT}/${id}`, { method: 'DELETE', token })
}

export async function apiFetchGalleryItems(token) {
  const payload = await request(GALLERY_ENDPOINT, token ? { token } : undefined)
  return unwrapData(payload)
}

export async function apiCreateGalleryItem({ title, description, imageFile }, token) {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('description', description)
  if (imageFile) formData.append('image', imageFile)

  const payload = await request(GALLERY_ENDPOINT, {
    method: 'POST',
    token,
    body: formData,
    isFormData: true,
  })
  return unwrapData(payload)
}

export async function apiUpdateGalleryItem(id, { title, description, imageFile }, token) {
  const formData = new FormData()
  if (title != null) formData.append('title', title)
  if (description != null) formData.append('description', description)
  if (imageFile) formData.append('image', imageFile)

  const payload = await request(`${GALLERY_ENDPOINT}/${id}`, {
    method: 'PUT',
    token,
    body: formData,
    isFormData: true,
  })
  return unwrapData(payload)
}

export async function apiDeleteGalleryItem(id, token) {
  await request(`${GALLERY_ENDPOINT}/${id}`, { method: 'DELETE', token })
}

