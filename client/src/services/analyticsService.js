import api from "./api";

export const getOverview = async () => {
  const res = await api.get("/analytics/overview");
  return res.data;
};

export const getVolume = async (days = 30) => {
  const res = await api.get("/analytics/volume", { params: { days } });
  return res.data;
};

export const getMuscleGroups = async () => {
  const res = await api.get("/analytics/muscle-groups");
  return res.data;
};

export const getWeightProgress = async () => {
  const res = await api.get("/analytics/weight-progress");
  return res.data;
};

export const getPersonalRecords = async () => {
  const res = await api.get("/analytics/personal-records");
  return res.data;
};
