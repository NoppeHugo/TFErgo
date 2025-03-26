const express = require('express')
const router = express.Router()
const { authenticateJWT } = require('../middleware/authenticateJWT')
const {
  getPatientNotes,
  addNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController')

router.use(authenticateJWT)

router.get('/:patientId', getPatientNotes)
router.post('/:patientId', addNote)
router.patch('/:id', updateNote)
router.delete('/:id', deleteNote)

module.exports = router
