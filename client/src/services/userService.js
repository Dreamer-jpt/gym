import api from "./api";

const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};

const deleteAccount = async () => {
  const res = await api.delete("/users/account");
  return res.data;
};

export { getProfile, updateProfile, deleteAccount };
export default api;
