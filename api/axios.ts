import axios from "axios";

export const api = axios.create({
  // baseURL: "http://100.25.133.67/",
  baseURL: "https://d3ofo9hlpt16jn.cloudfront.net/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only access localStorage in the browser
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);