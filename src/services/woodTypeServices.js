import api from "./axiosConfig";

const API_PATH = "/wood-types";

const woodTypeService = {
    getAll: () => api.get(API_PATH).then((res) => res.data),
    create: (data) => api.post(API_PATH, data).then((res) => res.data),
    update: (id, data) => api.put(`${API_PATH}/${id}`, data).then((res) => res.data),
    delete: (id) => api.delete(`${API_PATH}/${id}`).then((res) => res.data),
};

export default woodTypeService;
