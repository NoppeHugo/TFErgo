import axios from 'axios'
import API from './api.js';

// GET all patients
export const getAllPatients = async () => {
  const res = await API.get('/patients')
  return res.data
}



// GET one patient
export const getPatient = async (id) => {
  const res = await API.get(`/patients/${id}`)
  return res.data
}

// POST add new patient
export const createPatient = async (patientData) => {
    const res = await API.post('/patients', patientData);
    return res.data;
  };
  
// PATCH update patient
export const updatePatient = async (id, updates) => {
  const res = await API.patch(`/patients/${id}`, updates)
  return res.data
}

// DELETE patient
export const deletePatient = async (id) => {
  const res = await API.delete(`/patients/${id}`)
  return res.data
}
  