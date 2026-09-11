const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('divyaSwasthToken')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    // A missing token must also clear a stale signed-in UI. Ignore old requests
    // after a different session has signed in, and ordinary failed login attempts.
    if (response.status === 401 && !['/auth/login', '/auth/register'].includes(path) && localStorage.getItem('divyaSwasthToken') === token) {
      window.dispatchEvent(new Event('divya-auth-expired'))
    }
    const error = new Error(data.message || 'Something went wrong. Please try again.')
    error.statusCode = data.statusCode || response.status
    throw error
  }
  return data.data ?? data
}
