import axios from "axios";
import API from './api.js';

export const getPatientContacts = async (patientId) => {
  const res = await API.get(`/contacts/${patientId}`);
  return res.data;
};

export const addContact = async (patientId, contactData) => {
  const res = await API.post(`/contacts/${patientId}`, contactData);
  return res.data;
};

export const updateContact = async (contactId, contactData) => {
  const res = await API.patch(`/contacts/${contactId}`, contactData);
  return res.data;
};

export const deleteContact = async (contactId) => {
  const res = await API.delete(`/contacts/${contactId}`);
  return res.data;
};
