import axiosClient from './axiosClient';

export const getProducts = (params) => axiosClient.get('/products', { params });
export const getProduct = (id) => axiosClient.get(`/products/${id}`);
export const createProduct = (payload) => axiosClient.post('/products', payload);
export const updateProduct = (id, payload) => axiosClient.patch(`/products/${id}`, payload);
export const deleteProduct = (id) => axiosClient.delete(`/products/${id}`);

export const getMovements = (productId) => axiosClient.get(`/products/${productId}/movements`);
export const createMovement = (productId, payload) =>
  axiosClient.post(`/products/${productId}/movements`, payload);

export const getProductStats = () => axiosClient.get('/products/stats');

export const getRecentMovements = (limit = 8) =>
  axiosClient.get('/products/movements/recent', { params: { limit } });
