import axios from "axios";


const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

export const parentAPI = {
  getProfile: () => api.get("/parent/me"),
  updateProfile: (data) => api.put("/parent/me", data),
  deleteAccount: () => api.delete("/parent/me"),
};

export const childAPI = {
  getAll: () => api.get("/parent/me").then(res => res.data.children),
  add: (data) => api.post("/child", data),
  update: (id, data) => api.put(`/child/${id}`, data),
  delete: (id) => api.delete(`/child/${id}`),
  getOne: (id) => api.get(`/child/${id}`),
};

export const scanAPI = {
  scan: (code) => api.get(`/scan/${code}`),
};

export const statsAPI = {
  get: () => api.get("/stats"),
};

export default api;