import api from "./api";

export const getWorkouts = async (params) => {
  const res = await api.get("/workouts", { params });
  return res.data;
};

export const getWorkout = async (id) => {
  const res = await api.get(`/workouts/${id}`);
  return res.data;
};

export const createWorkout = async (data) => {
  const res = await api.post("/workouts", data);
  return res.data;
};

export const updateWorkout = async (id, data) => {
  const res = await api.put(`/workouts/${id}`, data);
  return res.data;
};

export const deleteWorkout = async (id) => {
  const res = await api.delete(`/workouts/${id}`);
  return res.data;
};

export const getWorkoutSummary = async () => {
  const res = await api.get("/workouts/stats/summary");
  return res.data;
};
