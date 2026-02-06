import api from "./axiosConfig";

const API_PATH = "/order";

const getOrders = async () => {
  try {
    const res = await api.get(`${API_PATH}/`);
    return res.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

const getOrderById = async (id) => {
  try {
    const res = await api.get(`${API_PATH}/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    throw err;
  }
};

const createOrder = async (orderData) => {
  try {
    const res = await api.post(`${API_PATH}/create`, orderData);
    return res.data;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

const updateOrder = async (id, orderData) => {
  try {
    const res = await api.put(`${API_PATH}/${id}`, orderData);
    return res.data;
  } catch (err) {
    console.error('Error updating order:', err);
    throw err;
  }
};

const deleteOrder = async (id) => {
  try {
    const res = await api.delete(`${API_PATH}/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting order:', err);
    throw err;
  }
};

const getOrderByUserId = async (id) => {
  try {
    const res = await api.get(`${API_PATH}/user-orders/${id}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    throw err;
  }
};


export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByUserId
};
