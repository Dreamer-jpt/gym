import api from "./api";

export const getExercises = async (params) => {
  const res = await api.get("/exercises", { params });
  return res.data;
};

export const getExercise = async (id) => {
  const res = await api.get(`/exercises/${id}`);
  return res.data;
};

export const createExercise = async (data) => {
  const res = await api.post("/exercises", data);
  return res.data;
};

export const updateExercise = async (id, data) => {
  const res = await api.put(`/exercises/${id}`, data);
  return res.data;
};

export const deleteExercise = async (id) => {
  const res = await api.delete(`/exercises/${id}`);
  return res.data;
};
