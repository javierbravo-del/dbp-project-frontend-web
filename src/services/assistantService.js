import api from './api'

export const assistantService = {
    async ask(pregunta) {
    const { data } = await api.post('/assistant', { pregunta }, { timeout: 120000 })
    return data
  },

  async getHistory({ page = 1, size = 20 } = {}, signal) {
    const { data } = await api.get('/assistant/history', {
      params: { page: page - 1, size },
      signal,
    })
    return data
  },
}
