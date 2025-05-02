import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const getEvaluationItemsByPatient = async (patientId) => {
  const res = await api.get(`/appointments/patients/${patientId}/evaluation-items`);
  return res.data;
};

export const createEvaluationItem = async (patientId, title) => {
    const res = await api.post(`/appointments/evaluation-items`, { patientId, title });
    return res.data;
  };

export const getAppointmentFeedbacks = async (appointmentId) => {
  const res = await api.get(`/appointments/${appointmentId}/feedbacks`);
  return res.data;
};

export const addAppointmentFeedbacks = async (appointmentId, feedbacks) => {
  const res = await api.post(`/appointments/${appointmentId}/feedbacks`, {
    feedbacks,
  });
  return res.data;
};