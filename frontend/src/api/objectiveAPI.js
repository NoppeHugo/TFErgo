import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

export const createLongTermObjective = async (motifId, data) => {
  const res = await api.post(`/objectives/long/${motifId}`, data);
  return res.data;
};

export const createShortTermObjective = async (longTermObjectiveId, data) => {
  const res = await api.post(`/objectives/short/${longTermObjectiveId}`, data);
  return res.data;
};
