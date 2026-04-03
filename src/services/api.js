const BASE_URL =
  import.meta.env.VITE_API_URL || "https://golf-backend-ad60.onrender.com/api";

const headers = (token, json = false) => ({
  ...(json && { "Content-Type": "application/json" }),
  ...(token && { Authorization: token }),
});

const post = (url, token, data) =>
  fetch(url, {
    method: "POST",
    headers: headers(token, !!data),
    ...(data && { body: JSON.stringify(data) }),
  }).then((r) => r.json());

const get = (url, token) =>
  fetch(url, { headers: headers(token) }).then((r) => r.json());

export const loginUser = (data) => post(`${BASE_URL}/auth/login`, null, data);
export const signupUser = (data) => post(`${BASE_URL}/auth/signup`, null, data);
export const subscribeUser = (token) =>
  post(`${BASE_URL}/auth/subscribe`, token);
export const getDashboard = (token) => get(`${BASE_URL}/dashboard`, token);
export const addScore = (token, data) =>
  post(`${BASE_URL}/score/add`, token, data);
export const getScores = (token) => get(`${BASE_URL}/score`, token);
export const runDraw = () => post(`${BASE_URL}/draw/run`);
export const getAllDraws = () => get(`${BASE_URL}/draw/all`);
export const getLatestDraw = () => get(`${BASE_URL}/draw/latest`);
export const getCharities = () => get(`${BASE_URL}/charity`);
export const selectCharity = (token, data) =>
  post(`${BASE_URL}/charity/select`, token, data);
export const addCharity = (data) => post(`${BASE_URL}/charity/add`, null, data);
