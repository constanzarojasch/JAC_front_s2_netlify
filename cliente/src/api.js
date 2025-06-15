import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export function fetchAllUsers() {
  return API.get('/admin/users').then((res) => res.data);
}

export function fetchUserById(id) {
  return API.get(`/admin/users/${id}`).then((res) => res.data);
}

export function deleteUserById(id) {
  return API.delete(`/admin/users/${id}`).then((res) => res.data);
}

export function fetchAllGames() {
  return API.get('/admin/games').then((res) => res.data);
}

export function deleteGameById(id) {
  return API.delete(`/admin/games/${id}`).then((res) => res.data);
}
export default API;

export function signUp({ username, password }) {
  return API.post('/user/signup', { username, password })
    .then((res) => res.data);
}

export function login({ username, password }) {
  return API.post('/user/login', { username, password })
    .then((res) => {
      // guarda token
      localStorage.setItem('token', res.data.token);
      return res.data.user;
    });
}

export function logout() {
  localStorage.removeItem('token');
}

export function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const { username, admin } = JSON.parse(atob(token.split('.')[1]));
  return { username, admin };
}
