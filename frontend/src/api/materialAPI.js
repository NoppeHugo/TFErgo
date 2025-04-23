import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const getMaterials = () => api.get('/materials');
export const createMaterial = (data) => api.post('/materials', data);
export const updateMaterial = (id, data) => api.patch(`/materials/${id}`, data);
export const deleteMaterial = (id) => api.delete(`/materials/${id}`);

