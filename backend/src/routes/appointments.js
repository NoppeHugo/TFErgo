const express = require('express');
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentsByPatientId,
  addAppointmentFeedback,
  updateAppointmentFeedback,
  getAppointmentFeedbacks,
  linkActivitiesToAppointment,
} = require('../controllers/appointmentController');

const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/patient/:patientId', getAppointmentsByPatientId); 
router.get('/:appointmentId/feedbacks', getAppointmentFeedbacks);
router.post('/:appointmentId/feedbacks', addAppointmentFeedback);
router.patch('/feedbacks/:id', updateAppointmentFeedback);
router.post('/:id/activities', linkActivitiesToAppointment);

module.exports = router;
