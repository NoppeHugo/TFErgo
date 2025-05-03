import axios from 'axios';
import API from './api.js';

export const getPatientHealthData = async (patientId) => {
  const res = await API.get(`/health/${patientId}`);
  return res.data;
};

export const updatePatientHealthData = async (patientId, updates) => {
  const res = await API.patch(`/health/${patientId}`, updates);
  return res.data;
};
