const express = require('express');
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentsByPatientId,
  addAppointmentFeedbacks,
  updateAppointmentFeedback,
  getEvaluationItemsByPatient,
  linkActivitiesToAppointment,
  getAppointmentFeedbacksByAppointment,
  createEvaluationItem,
  getAppointmentsByMonth,
  deleteEvaluationItem,
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
router.get('/month/:month',  getAppointmentsByMonth);


router.get('/patients/:patientId/evaluation-items', getEvaluationItemsByPatient);
router.get('/patients/:id/evaluation-items', getEvaluationItemsByPatient);
router.get('/appointments/:id/feedbacks', getAppointmentFeedbacksByAppointment);
router.post('/evaluation-items', createEvaluationItem);
router.get('/:id/feedbacks', getAppointmentFeedbacksByAppointment);




router.post('/:appointmentId/feedbacks', addAppointmentFeedbacks);
router.patch('/feedbacks/:id', updateAppointmentFeedback);
router.delete('/evaluation-items/:id', deleteEvaluationItem);



router.post('/:id/activities', linkActivitiesToAppointment);


module.exports = router;
