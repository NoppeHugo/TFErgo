import API from './api.js';

export const getMotifsByPatient = async (patientId) => {
  const res = await API.get(`/motifs/${patientId}`);
  return res.data;
};

export const createMotif = async (patientId, motif) => {
  const res = await API.post(`/motifs/${patientId}`, motif);
  return res.data;
};

export const updateMotif = async (id, updates) => {
  const res = await API.patch(`/motifs/${id}`, updates);
  return res.data;
};
