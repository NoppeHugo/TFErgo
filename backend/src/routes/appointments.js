const express = require('express');
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
} = require('../controllers/appointmentController');

const { authenticateJWT } = require("../middleware/authenticateJWT");

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.patch('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
