import api from './api';

const stockService = {
  async getLowStock({ page = 1, size = 5 } = {}, signal) {
    const { data } = await api.get('/stock-movements/low-stock', {
      params: { page: page - 1, size },
      signal,
    });
    return data;
  },

  async registerInbound({ varianteId, cantidad, motivo }) {
    const { data } = await api.post('/stock-movements/inbound', { varianteId, cantidad, motivo });
    return data;
  },
};

export default stockService;
