// axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3212', // thay đổi nếu cần
  withCredentials: true, // BẮT BUỘC để gửi cookie
});

export default api;
