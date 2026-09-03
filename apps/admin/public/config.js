window.__LUCKYZONE_CONFIG__ = window.__LUCKYZONE_CONFIG__ || {};

const luckyZoneIsLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const luckyZoneIsLanHost = window.location.hostname === "192.168.1.60";
const luckyZoneIsProductionHost = ["luckyzone.lk", "www.luckyzone.lk", "admin.luckyzone.lk"].includes(window.location.hostname);

window.__LUCKYZONE_CONFIG__.API_URL = window.__LUCKYZONE_CONFIG__.API_URL || (
  luckyZoneIsLocalHost
    ? "http://localhost:5005/api"
    : luckyZoneIsLanHost
      ? "http://192.168.1.60:5005/api"
      : luckyZoneIsProductionHost
        ? "https://luckyzone.lk/backend/api"
        : `${window.location.origin}/api`
);

window.__LUCKYZONE_CONFIG__.WEB_URL = window.__LUCKYZONE_CONFIG__.WEB_URL || (
  luckyZoneIsLocalHost
    ? "http://localhost:5173"
    : luckyZoneIsProductionHost
      ? "https://luckyzone.lk"
      : window.location.origin
);
