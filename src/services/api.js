import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Algorithms API
export const algorithmService = {
  getAll: async (category) => {
    const params = category ? { category } : {}
    const response = await api.get('/algorithms', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/algorithms/${id}`)
    return response.data
  },
  
  seed: async () => {
    const response = await api.post('/algorithms/seed')
    return response.data
  },
}

// Users API
export const userService = {
  getAll: async () => {
    const response = await api.get('/users')
    return response.data
  },
  
  create: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data
  },
  
  getCount: async () => {
    const response = await api.get('/users/stats/count')
    return response.data
  },
}

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
