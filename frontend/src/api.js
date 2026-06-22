import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  baseURL: "https://verifydotpro-production.up.railway.app/api",
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("adminToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

api.interceptors.response.use(
  (response) => {
    console.log("SUCCESS:", response);
    return response;
  },
  (error) => {
    console.log("ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    return Promise.reject(error);
  },
);

export default api;
