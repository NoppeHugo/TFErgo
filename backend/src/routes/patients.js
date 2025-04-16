const express = require('express')
const router = express.Router()
const {
  getMyPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController')
const { authenticateJWT } = require('../middleware/authenticateJWT')

router.use(authenticateJWT)

router.get('/', getMyPatients)
router.get('/:id', getPatientById)
router.post('/', createPatient)
router.patch('/:id', updatePatient)
router.delete('/:id', deletePatient)

module.exports = router