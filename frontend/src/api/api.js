import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export default API;

export const patch = (url, data, config) => API.patch(url, data, config);