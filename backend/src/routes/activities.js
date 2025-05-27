const express = require('express');
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  searchActivities
} = require('../controllers/activityController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

const router = express.Router();

router.get('/', getAllActivities);
router.get('/search', searchActivities);
router.get('/:id', getActivityById);
router.post('/', authenticateJWT, createActivity);
router.patch('/:id', authenticateJWT, updateActivity);
router.delete('/:id', authenticateJWT, deleteActivity);

module.exports = router;
