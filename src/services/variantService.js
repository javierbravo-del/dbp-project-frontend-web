import api from './api'

export const variantService = {
  async getByProduct(productId, { page = 1, size = 10, sort = 'id,asc' } = {}, signal) {
    const { data } = await api.get(`/products/${productId}/variants`, {
      params: { page: page - 1, size, sort },
      signal,
    })
    return data
  },

  async create(productId, payload) {
    const { data } = await api.post(`/products/${productId}/variants`, payload)
    return data
  },

  async update(variantId, payload) {
    const { data } = await api.put(`/variants/${variantId}`, payload)
    return data
  },
}