import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const session = localStorage.getItem('session')
  if (session) {
    const { access_token } = JSON.parse(session)
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
})

export default api
