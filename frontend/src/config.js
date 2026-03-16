// src/config.js
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://food-order-backend-s5it.onrender.com";

export { API_URL };