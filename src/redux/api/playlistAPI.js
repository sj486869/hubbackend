import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/playlists`,
  withCredentials: true,
});

// ✅ Create new playlist
export const createPlaylistAPI = (formData) =>
  api.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Get all playlists of current user
export const getUserPlaylistsAPI = () => api.get("");

// ✅ Get playlist by ID
export const getPlaylistByIdAPI = (id) => api.get(`/${id}`);

// ✅ Update playlist
export const updatePlaylistAPI = (id, formData) =>
  api.patch(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Delete playlist
export const deletePlaylistAPI = (id) => api.delete(`/${id}`);

// ✅ Add / remove videos
export const addVideoToPlaylistAPI = (id, videoId) =>
  api.patch(`/${id}/add-video`, { videoId });

export const removeVideoFromPlaylistAPI = (id, videoId) =>
  api.patch(`/${id}/remove-video`, { videoId });
