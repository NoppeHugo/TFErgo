import API from './api.js';


export const getAllAppointments = async () => {
  const res = await API.get("/appointments");
  return res.data;
};

export const getAppointment = async (id) => {
  const res = await API.get(`/appointments/${id}`);
  return res.data;
};

export const createAppointment = async (data) => {
  const res = await API.post("/appointments", data);
  return res.data;
};

export const updateAppointment = async (id, data) => {
  const res = await API.patch(`/appointments/${id}`, data);
  return res.data;
};

export const deleteAppointment = async (id) => {
  const res = await API.delete(`/appointments/${id}`);
  return res.data;
};

export const getAppointmentsByPatient = async (patientId) => {
  const res = await API.get(`/appointments/patient/${patientId}`);
  return res.data;
};

export const linkActivitiesToAppointment = async (appointmentId, activityIds) => {
  const res = await API.post(`/appointments/${appointmentId}/activities`, { activityIds });
  return res.data;
};
