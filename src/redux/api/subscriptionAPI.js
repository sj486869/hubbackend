import axios from "axios";
import { API_BASE_URL } from "../../redux/apiUrl";

const api = axios.create({
  baseURL: `${API_BASE_URL}/subscriptions`,
  withCredentials: true,
});

// 👉 Toggle subscription (subscribe/unsubscribe)
export const toggleSubscriptionAPI = (creatorId) =>
  api.post(`/toggle/${creatorId}`);

// 👉 Get all creators a user subscribed to
export const getSubscribedCreators = (userId) =>
  api.get(`/${userId}/subscribed`);

// 👉 Get all creators
export const getCreatorsAPI = () => api.get("/");

// 👉 Get creator by ID
export const getCreatorByIdAPI = (id) => api.get(`/${id}`);
