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

  const isJson = response.headers.get('content-type')?.includes('application/json')
  if (!isJson) {
    if (response.status === 413) throw new Error('The server rejected this file size. Try a smaller image.')
    throw new Error('The upload/API server is not responding correctly. Check the backend URL and restart or redeploy the app.')
  }
  const data = await response.json()
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
