import api from './api'

export const userService = {
  async getAll({ page = 1, size = 20 } = {}, signal) {
    const { data } = await api.get('/users', {
      params: { page: page - 1, size, sort: 'nombre,asc' },
      signal,
    })
    return data
  },

  async createEmployee({ nombre, email, password }) {
    const { data } = await api.post('/users', { nombre, email, password, role: 'EMPLEADO' })
    return data
  },

  async remove(id) {
    await api.delete(`/users/${id}`)
  },
}
