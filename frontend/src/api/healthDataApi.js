import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const getPatientHealthData = async (patientId) => {
  const res = await api.get(`/health/${patientId}`);
  return res.data;
};

export const updatePatientHealthData = async (patientId, updates) => {
  const res = await api.patch(`/health/${patientId}`, updates);
  return res.data;
};
