import axios from './axiosConfig';

const adminService = {
    getStats: async () => {
        try {
            const response = await axios.get('/admin/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
            throw error;
        }
    },
};

export default adminService;
