const express = require('express');
const {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  searchActivities
} = require('../controllers/activityController');

const router = express.Router();

router.get('/', getAllActivities);
router.get('/search', searchActivities);
router.get('/:id', getActivityById);
router.post('/', createActivity);
router.patch('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
