import API from './api.js';

export const getEvaluationItemsByPatient = async (patientId) => {
  const res = await API.get(`/appointments/patients/${patientId}/evaluation-items`);
  return res.data;
};

export const createEvaluationItem = async (patientId, title) => {
    const res = await API.post(`/appointments/evaluation-items`, { patientId, title });
    return res.data;
  };

export const getAppointmentFeedbacks = async (appointmentId) => {
  const res = await API.get(`/appointments/${appointmentId}/feedbacks`);
  return res.data;
};

export const addAppointmentFeedbacks = async (appointmentId, feedbacks) => {
  const res = await API.post(`/appointments/${appointmentId}/feedbacks`, {
    feedbacks,
  });
  return res.data;
};