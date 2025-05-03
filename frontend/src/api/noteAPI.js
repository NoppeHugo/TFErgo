import axios from "axios"
import API from './api.js';

export const getPatientNotes = async (patientId) => {
  const res = await API.get(`/notes/${patientId}`)
  return res.data
}

export const addNoteToPatient = async (patientId, data) => {
  const res = await API.post(`/notes/${patientId}`, data)
  return res.data
}

export const updateNote = async (noteId, data) => {
  const res = await API.patch(`/notes/${noteId}`, data)
  return res.data
}

export const deleteNote = async (noteId) => {
  const res = await API.delete(`/notes/${noteId}`)
  return res.data
}
