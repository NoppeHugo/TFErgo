import API from './api.js';

export const createLongTermObjective = async (motifId, data) => {
  const res = await API.post(`/objectives/long/${motifId}`, data);
  return res.data;
};

export const createShortTermObjective = async (longTermObjectiveId, data) => {
  const res = await API.post(`/objectives/short/${longTermObjectiveId}`, data);
  return res.data;
};

export const updateLongTermObjective = async (id, data) => {
  const res = await API.patch(`/objectives/long/${id}`, data);
  return res.data;
};

export const deleteLongTermObjective = async (id) => {
  const res = await API.delete(`/objectives/long/${id}`);
  return res.data;
};

export const updateShortTermObjective = async (id, data) => {
  const res = await API.patch(`/objectives/short/${id}`, data);
  return res.data;
}

export const deleteShortTermObjective = async (id) => {
  const res = await API.delete(`/objectives/short/${id}`);
  return res.data;
};
