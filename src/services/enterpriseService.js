import api from './api'

export const enterpriseService = {
  async create(payload) {
    const { data } = await api.post('/enterprises', payload)
    return data
  },
}
