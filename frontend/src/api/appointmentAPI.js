import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export const getAllAppointments = async () => {
  const res = await api.get("/appointments");
  return res.data;
};

export const getAppointment = async (id) => {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
};

export const createAppointment = async (data) => {
  const res = await api.post("/appointments", data);
  return res.data;
};

export const updateAppointment = async (id, data) => {
  const res = await api.patch(`/appointments/${id}`, data);
  return res.data;
};

export const deleteAppointment = async (id) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};

export const getAppointmentsByPatient = async (patientId) => {
  const res = await api.get(`/appointments/patient/${patientId}`);
  return res.data;
};

export const linkActivitiesToAppointment = async (appointmentId, activityIds) => {
  const res = await api.post(`/appointments/${appointmentId}/activities`, { activityIds });
  return res.data;
};
