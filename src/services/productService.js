import api from './api'

export const productService = {
  async getAll({ page = 1, size = 10, sort = 'nombre,asc', soloActivos = true } = {}, signal) {
    const { data } = await api.get('/products', {
      params: { page: page - 1, size, sort, soloActivos },
      signal,
    })
    return data
  },

  async getById(id, signal) {
    const { data } = await api.get(`/products/${id}`, { signal })
    return data
  },

  async create(payload) {
    const { data } = await api.post('/products', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload)
    return data
  },

  async patch(id, payload) {
    const { data } = await api.patch(`/products/${id}`, payload)
    return data
  },

  async deactivate(id) {
    await api.delete(`/products/${id}`)
  },
}
