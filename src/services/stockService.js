import api from './api';

const stockService = {
  // Disponible para ADMIN y EMPLEADO. Devuelve las variantes con stock bajo (paginado, 0-based en backend)
  async getLowStock({ page = 1, size = 5 } = {}, signal) {
    const { data } = await api.get('/stock-movements/low-stock', {
      params: { page: page - 1, size },
      signal,
    });
    return data;
  },
};

export default stockService;
