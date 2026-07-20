import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8888";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  const tokenType = localStorage.getItem("auth_token_type");
  if (token) {
    config.headers.Authorization = `${tokenType || "Bearer"} ${token}`;
  }
  return config;
});

export const mediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

export default client;
