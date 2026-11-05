import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials)
    tokenStorage.setTokens(data)
    return data.user
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    tokenStorage.setTokens(data)
    return data.user
  },

  async restoreSession() {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) return null

    try {
      const { data } = await api.post('/auth/refresh', { refreshToken })
      tokenStorage.setTokens(data)
      return data.user
    } catch {
      tokenStorage.clear()
      return null
    }
  },

  logout() {
    tokenStorage.clear()
  },
}