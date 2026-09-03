import axios from "axios";

const config = window.__LUCKYZONE_CONFIG__ || {};
const apiBaseUrl = config.API_URL || "http://localhost:5005/api";

const api = axios.create({
  baseURL: apiBaseUrl
});

export const serverOrigin = apiBaseUrl.replace(/\/api\/?$/, "");
const clientOrigin = config.WEB_URL || window.location.origin;

export function assetUrl(path) {
  if (!path || path.startsWith("http") || path.startsWith("data:")) return path;
  return path.startsWith("/uploads/") ? `${serverOrigin}${path}` : `${clientOrigin}${path}`;
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/admin/uploads", form);
  return data.url;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("luckyzone_admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
