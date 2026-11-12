import api from './api'

export const categoryService = {
  async getAll({ size = 100 } = {}, signal) {
    const { data } = await api.get('/categories', {
      params: { size, sort: 'nombre,asc' },
      signal,
    })
    return data.content
  },

  async getPage({ page = 1, size = 10, sort = 'nombre,asc', search = '' } = {}, signal) {
    const { data } = await api.get('/categories', {
      params: { page: page - 1, size, sort, search: search || undefined },
      signal,
    })
    return data
  },

  async getById(id, signal) {
    const { data } = await api.get(`/categories/${id}`, { signal })
    return data
  },

  async create(payload) {
    const { data } = await api.post('/categories', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/categories/${id}`, payload)
    return data
  },

  async deactivate(id) {
    await api.delete(`/categories/${id}`)
  },
}
