import axios from "axios";
import { ensureEnvVar } from "../utils/ensure-env-var.util";

const apiKey = ensureEnvVar(
  import.meta.env.VITE_BACKEND_API_KEY,
  "VITE_BACKEND_API_KEY"
);

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers.Authorization = apiKey;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message || error.message || "Unknown error",
      status: error.response?.status || 500,
      details: error.response?.data || {},
    };
    return Promise.reject(customError);
  }
);

export default axiosInstance;
