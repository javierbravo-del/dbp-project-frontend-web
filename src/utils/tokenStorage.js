const REFRESH_TOKEN_KEY = 'refreshToken'

let accessToken = null

export const tokenStorage = {
  getAccessToken: () => accessToken,

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: ({ token, refreshToken }) => {
    accessToken = token
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clear: () => {
    accessToken = null
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}