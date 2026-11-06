import api from './api'

export const purchaseService = {
  async getAll({ page = 1, size = 10, sort = 'fechaEmision,desc', desde, hasta } = {}, signal) {
    const { data } = await api.get('/purchase-orders', {
      params: { page: page - 1, size, sort, desde, hasta },
      signal,
    })
    return data
  },

  async getById(id, signal) {
    const { data } = await api.get(`/purchase-orders/${id}`, { signal })
    return data
  },

  async create(payload) {
    const { data } = await api.post('/purchase-orders', payload)
    return data
  },
}
