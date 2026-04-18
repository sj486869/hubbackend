import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  withCredentials: true,
});

export const signupUser = (formData) =>
  api.post("/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginUser = (data) =>
  api.post("/login", data, {
    headers: { "Content-Type": "application/json" },
  });

export const upgradeCreator = () => api.patch("/upgrade-creator");

export const fetchCurrentUser = () => api.get("/auth");

export const logoutUser = () => api.post("/logout");

export const updateUser = (userId, formData) =>
  api.patch(`/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteUser = () => api.delete("/delete");
