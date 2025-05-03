import axios from 'axios';
import API from './api.js';

export const getMaterials = () => API.get('/materials');
export const createMaterial = (data) => API.post('/materials', data);
export const updateMaterial = (id, data) => API.patch(`/materials/${id}`, data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);

