import axios from "axios";

export const api = axios.create({
  baseURL: "http://100.25.133.67/",
  // baseURL: "https://dzrwsebpgjwmd.cloudfront.net/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
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
    // Just pass through the error without removing token
    return Promise.reject(error);
  }
);