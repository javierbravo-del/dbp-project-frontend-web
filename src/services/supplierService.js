import api from './api'

export const supplierService = {
  async getAll({ page = 1, size = 10, sort = 'razonSocial,asc', search = '' } = {}, signal) {
    const { data } = await api.get('/suppliers', {
      params: { page: page - 1, size, sort, search: search || undefined },
      signal,
    })
    return data
  },

  async getById(id, signal) {
    const { data } = await api.get(`/suppliers/${id}`, { signal })
    return data
  },

  async create(payload) {
    const { data } = await api.post('/suppliers', payload)
    return data
  },
}
