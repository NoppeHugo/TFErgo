const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const { generatePatientReport } = require('../controllers/reportController');

router.post('/:patientId', authenticateJWT, generatePatientReport);

module.exports = router;
