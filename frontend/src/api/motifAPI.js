import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export const getMotifsByPatient = async (patientId) => {
  const res = await api.get(`/motifs/${patientId}`);
  return res.data;
};

export const createMotif = async (patientId, motif) => {
  const res = await api.post(`/motifs/${patientId}`, motif);
  return res.data;
};

export const updateMotif = async (id, updates) => {
  const res = await api.patch(`/motifs/${id}`, updates);
  return res.data;
};
