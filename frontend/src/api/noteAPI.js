import axios from "axios"

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true
})

export const getPatientNotes = async (patientId) => {
  const res = await api.get(`/notes/${patientId}`)
  return res.data
}

export const addNoteToPatient = async (patientId, data) => {
  const res = await api.post(`/notes/${patientId}`, data)
  return res.data
}

export const updateNote = async (noteId, data) => {
  const res = await api.patch(`/notes/${noteId}`, data)
  return res.data
}

export const deleteNote = async (noteId) => {
  const res = await api.delete(`/notes/${noteId}`)
  return res.data
}
