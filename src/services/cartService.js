import api from "./axiosConfig";

const API_PATH = "/cart";

const cartService = {
  // Lấy giỏ hàng
  getCart: (userId) =>
    api.get(`${API_PATH}`, {
      params: { userId },
      withCredentials: true,
    }),

  // Thêm vào giỏ (productId - backend dùng product)
  addToCart: (userId, productId, quantity = 1) =>
    api.post(
      `${API_PATH}/add`,
      { userId, productId, quantity }
    ),

  // Cập nhật số lượng
  updateQuantity: (cartItemId, userId, quantity) =>
    api.patch(
      `${API_PATH}/${cartItemId}/quantity`,
      { userId, quantity }
    ),

  // Xóa 1 item
  removeItem: (cartItemId, userId) =>
    api.delete(`${API_PATH}/${cartItemId}`, {
      data: { userId },
    }),

  // Xóa toàn bộ giỏ
  clearCart: (userId) =>
    api.delete(`${API_PATH}`, {
      params: { userId },
    }),
};

export default cartService;
