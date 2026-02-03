import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";

const UserDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async (limit) => {
    try {
      const res = await axios.get("/order/get", {
        params: {
          userId: user.id,
          limit: limit,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Lấy 5 đơn hàng gần nhất khi load trang
  useEffect(() => {
    fetchOrders(5);
  }, []);

  const handleClick = () => {
    navigate(`/deposit`);
  };

  const handleChangePassword = () => {
    navigate(`/change-password`);
  };

  const statusMap = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };

  return (
    <div className="flex item-center justify-between pt-6 w-full gap-6 flex-col md:flex-row p-8">
      {/* Left: User info */}
      <div className="md:w-1/3 w-full bg-gray-100 rounded-xl flex flex-col gap-4 shadow-sm p-6">
        <h2 className="text-xl font-bold mb-2">Thông tin người dùng</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Tên: </span>
            <span>{user.name}</span>
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="font-semibold">Mật khẩu: </span>
            <span>******</span>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold w-fit">
          Sửa thông tin
        </button>
      </div>

      {/* Right: Orders list */}
      <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Danh sách đơn hàng</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Đơn hàng
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 font-semibold text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {order.total.toLocaleString()} đ
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        order.status === "Đã giao"
                          ? "text-green-600 font-semibold"
                          : order.status === "Đã hủy"
                            ? "text-red-500 font-semibold"
                            : "text-yellow-600 font-semibold"
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
