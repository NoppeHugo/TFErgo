const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');

// GET /therapists
router.get('/', therapistController.getAllTherapists);

module.exports = router;
