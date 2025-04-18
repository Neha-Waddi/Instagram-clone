// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://instagram-clone-m0ay.onrender.com/api',
  withCredentials:true,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
