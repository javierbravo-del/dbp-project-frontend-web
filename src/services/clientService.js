import api from './api'

export const clientService = {
  async getAll({ page = 1, size = 10, sort = 'nombre,asc' } = {}, signal) {
    const { data } = await api.get('/clients', {
      params: { page: page - 1, size, sort },
      signal,
    })
    return data
  },

  async getById(id, signal) {
    const { data } = await api.get(`/clients/${id}`, { signal })
    return data
  },

  async create(payload) {
    const { data } = await api.post('/clients', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/clients/${id}`, payload)
    return data
  },

  async remove(id) {
    await api.delete(`/clients/${id}`)
  },
}
