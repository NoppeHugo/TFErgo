import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from '../controllers/goalController.js';

const router = express.Router();

router.get('/', getGoals);
router.post('/', createGoal);
router.patch('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
