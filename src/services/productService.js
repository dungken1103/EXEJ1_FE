import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3212";
const API_URL = `${API_BASE}/products`;

const productService = {
  getById: (id) => axios.get(`${API_URL}/${id}`),

  getAll: (params) => axios.get(API_URL, { params }),

  search: (name, page = 1, limit = 10) =>
    axios.get(`${API_URL}/search`, { params: { name, page, limit } }),
};

export default productService;
