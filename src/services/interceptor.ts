import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  headers: {
    "content-type": "application/json",
    VERCEL_AUTOMATION_BYPASS_SECRET:
      process.env.VUE_APP_VERCEL_AUTOMATION_BYPASS_SECRET ||
      (process.env as any).VUE_APP_API_VERCEL_AUTOMATION_BYPASS_SECRET ||
      "",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error("[API ERROR]", status, data || error.message);
    return Promise.reject(error);
  }
);

export default api;
