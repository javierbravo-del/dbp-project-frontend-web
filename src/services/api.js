import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

const API_URL = import.meta.env.VITE_API_URL
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 800

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryable = (error) => {
  const config = error.config
  if (!config || config.method !== 'get' || error.code === 'ERR_CANCELED') {
    return false
  }
  return !error.response || error.response.status >= 500
}

let refreshPromise = null

const refreshAccessToken = async () => {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }
  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
  tokenStorage.setTokens(data)
  return data.token
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isRetryable(error)) {
      const config = error.config
      config._retryCount = (config._retryCount ?? 0) + 1
      if (config._retryCount <= MAX_RETRIES) {
        await wait(RETRY_DELAY_MS * config._retryCount)
        return api(config)
      }
    }

    const originalRequest = error.config
    const isUnauthorized = error.response?.status === 401
    const isAuthRoute = originalRequest?.url?.startsWith('/auth/')

    if (!isUnauthorized || !originalRequest || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const newToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    } catch {
      tokenStorage.clear()
      window.dispatchEvent(new Event('auth:logout'))
      return Promise.reject(error)
    }
  },
)

export default api