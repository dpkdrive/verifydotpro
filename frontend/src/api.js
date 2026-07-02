import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.log("==================");
  // console.log("API:", config.url);
  // console.log("TOKEN:", token);
  // console.log("HEADERS:", config.headers);
  // console.log("==================");

  return config;
});
