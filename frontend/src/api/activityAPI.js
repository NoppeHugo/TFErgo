import API from './api.js';

export const getActivities = () => API.get('/activities');
export const getActivityById = (id) => API.get(`/activities/${id}`);
export const searchActivities = (params) => API.get('/activities/search', { params });
export const createActivity = (data) => API.post('/activities', data);
export const updateActivity = (id, data) => API.patch(`/activities/${id}`, data);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);
export const uploadFileToActivity = (id, fileData) => API.post(`/files/${id}/files`, fileData);
export const deleteFile = (fileId) => API.delete(`/files/file/${fileId}`);
