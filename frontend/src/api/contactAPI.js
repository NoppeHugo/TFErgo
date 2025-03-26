import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const getPatientContacts = async (patientId) => {
  const res = await api.get(`/contacts/${patientId}`);
  return res.data;
};

export const addContact = async (patientId, contactData) => {
  const res = await api.post(`/contacts/${patientId}`, contactData);
  return res.data;
};

export const updateContact = async (contactId, contactData) => {
  const res = await api.patch(`/contacts/${contactId}`, contactData);
  return res.data;
};

export const deleteContact = async (contactId) => {
  const res = await api.delete(`/contacts/${contactId}`);
  return res.data;
};
