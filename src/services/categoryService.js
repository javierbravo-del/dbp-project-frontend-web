import api from './api'

export const categoryService = {
  async getAll({ size = 100 } = {}, signal) {
    const { data } = await api.get('/categories', {
      params: { size, sort: 'nombre,asc' },
      signal,
    })
    return data.content
  },
}
