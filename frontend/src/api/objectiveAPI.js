import axios from "axios";
import API from './api';


export const createLongTermObjective = async (motifId, data) => {
  const res = await API.post(`/objectives/long/${motifId}`, data);
  return res.data;
};

export const createShortTermObjective = async (longTermObjectiveId, data) => {
  const res = await API.post(`/objectives/short/${longTermObjectiveId}`, data);
  return res.data;
};
