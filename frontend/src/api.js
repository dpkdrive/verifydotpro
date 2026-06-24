import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  console.log("========================");
  console.log("API:", config.url);

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Authorization Header:", config.headers.Authorization);
  console.log("========================");

  return config;
});

export default api;