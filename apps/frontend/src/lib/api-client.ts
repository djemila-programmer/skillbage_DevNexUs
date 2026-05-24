const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || `HTTP ${response.status}`)
  }

  return response.json().catch(() => null)
}

export const apiClient = {
  updateProfile: (payload: Record<string, unknown>) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  getUsers: () => request('/users'),
  getUser: (id: string) => request(`/users/${id}`),
}
