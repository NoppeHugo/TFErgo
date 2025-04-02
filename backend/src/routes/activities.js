// backend/src/routes/activities.js
import express from 'express';
import {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  searchActivities
} from '../controllers/activityController.js';
const router = express.Router();

router.get('/', getAllActivities);
router.get('/search', searchActivities);
router.get('/:id', getActivityById);
router.post('/', createActivity);
router.patch('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
