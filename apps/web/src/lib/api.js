import axios from "axios";

const config = window.__LUCKYZONE_CONFIG__ || {};
const apiBaseUrl = config.API_URL || "http://localhost:5005/api";
const serverOrigin = apiBaseUrl.replace(/\/api\/?$/, "");

const api = axios.create({ baseURL: apiBaseUrl });

export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (path.startsWith("/uploads/")) return `${serverOrigin}${path}`;
  return path;
}

export default api;
