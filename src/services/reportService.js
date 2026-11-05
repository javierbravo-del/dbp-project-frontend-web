import api from './api';

const reportService = {
  async getSummary({ desde, hasta }, signal) {
    const { data } = await api.get('/reports/summary', {
      params: { desde, hasta },
      signal,
    });
    return data;
  },

  async getTopProducts({ desde, hasta, criterio = 'UNIDADES', limite = 5 }, signal) {
    const { data } = await api.get('/reports/top-products', {
      params: { desde, hasta, criterio, limite },
      signal,
    });
    return data;
  },

  async getGroupedSales({ desde, hasta, por }, signal) {
    const { data } = await api.get('/reports/grouped-sales', {
      params: { desde, hasta, por },
      signal,
    });
    return data;
  },
};

export default reportService;