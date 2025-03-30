const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middleware/authenticateJWT');
const {
  updateHealthData,
  getHealthData
} = require('../controllers/healthDataController');

router.use(authenticateJWT);

router.get('/:id', getHealthData);
router.patch('/:id', updateHealthData);

module.exports = router;