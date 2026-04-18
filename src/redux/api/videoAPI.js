import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/videos`,
  withCredentials: true,
});

// 📤 Upload Video
export const uploadVideoAPI = (formData, onUploadProgress) =>
  api.post("/", formData, { onUploadProgress });

// 📜 Get All Videos
export const getAllVideosAPI = (params) => api.get("/", { params });

// 🔍 Get Single Video
export const getVideoByIdAPI = (id) => api.get(`/${id}`);

// 👁️ Increment View Count
export const incrementViewAPI = (id) => api.post(`/${id}/view`);

// ❤️ Like / Unlike Video
export const toggleLikeAPI = (id) => api.post(`/${id}/like`);

// 🔖 Save / Unsave Video
export const toggleSaveAPI = (videoId) => api.put(`/saved/${videoId}`);

// ✏️ Update Video
export const updateVideoAPI = (id, formData) =>
  api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 🗑️ Delete Video
export const deleteVideoAPI = (id) => api.delete(`/${id}`);

// 🎞️ Get Creator’s Videos
export const getCreatorVideosAPI = () => api.get("/creator/videos");

// 🏆 Get Top Videos
export const getTopVideos = () => api.get("/top");
