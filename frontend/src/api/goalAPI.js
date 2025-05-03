import axios from 'axios';
import API from './api.js';

export const getGoals = () => API.get('/goals');
export const createGoal = (data) => API.post('/goals', data);
export const updateGoal = (id, data) => API.patch(`/goals/${id}`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);
