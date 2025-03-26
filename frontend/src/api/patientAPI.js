import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, 
})

// GET all patients
export const getAllPatients = async () => {
  const res = await api.get('/patients')
  return res.data
}

// GET one patient
export const getPatient = async (id) => {
  const res = await api.get(`/patients/${id}`)
  return res.data
}

// POST add new patient
export const createPatient = async (patientData) => {
    const res = await api.post('/patients', patientData);
    return res.data;
  };
  



// PATCH update patient
export const updatePatient = async (id, updates) => {
  const res = await api.patch(`/patients/${id}`, updates)
  return res.data
}

// DELETE patient
export const deletePatient = async (id) => {
  const res = await api.delete(`/patients/${id}`)
  return res.data
}
  