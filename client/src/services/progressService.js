import api from "./api";

export const getProgress = async (params) => {
  const res = await api.get("/progress", { params });
  return res.data;
};

export const getLatestProgress = async () => {
  const res = await api.get("/progress/latest");
  return res.data;
};

export const createProgress = async (data) => {
  const res = await api.post("/progress", data);
  return res.data;
};

export const updateProgress = async (id, data) => {
  const res = await api.put(`/progress/${id}`, data);
  return res.data;
};

export const deleteProgress = async (id) => {
  const res = await api.delete(`/progress/${id}`);
  return res.data;
};
