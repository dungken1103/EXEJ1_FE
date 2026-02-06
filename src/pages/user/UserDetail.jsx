import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import toast from "../../utils/toast";
import { useAuth } from "../../contexts/AuthContext";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
  HiOutlineTicket,
  HiOutlinePencilSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
  HiOutlineCheck
} from "react-icons/hi2";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";

const UserDetail = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, successfulOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // Initial Data Fetch
  useEffect(() => {
    if (user?.id) {
      setFormData({
        name: user.name || "",
        phone: user.phone || ""
      });
      fetchStats();
      fetchOrders();
      // Reload full user profile to check hasPassword
      fetchUserProfile();
    }
  }, [user?.id]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`/users/${user.id}`);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Persist critical flags like hasPassword
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/users/${user.id}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/order/get", {
        params: {
          userId: user.id,
          limit: 5,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Profile Edit Handlers ---
  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await axios.put(`/users/${user.id}`, formData);
      const updatedUser = { ...user, ...formData };
      toast.success("Cập nhật thông tin thành công");
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      toast.error("Lỗi", "Không thể cập nhật thông tin");
    }
  };

  // --- Password Change Handlers ---
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword.length < 6) {
      toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await axios.put(`/users/${user.id}/change-password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Đổi mật khẩu thành công");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error("Lỗi", err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Stats Cards Data
  const statCards = [
    {
      label: "Tổng chi tiêu",
      value: `${stats.totalSpent.toLocaleString()}₫`,
      icon: HiOutlineCurrencyDollar,
      color: "bg-green-100 text-green-700"
    },
    {
      label: "Đơn hàng",
      value: stats.totalOrders,
      icon: HiOutlineShoppingBag,
      color: "bg-blue-100 text-blue-700"
    },
    {
      label: "Đơn thành công",
      value: stats.successfulOrders,
      icon: HiOutlineCheck,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: brandBrown }}>Hồ sơ của tôi</h1>
            <p className="text-gray-500 mt-1">Quản lý thông tin hồ sơ và bảo mật tài khoản</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-sm font-medium"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#2d5a27] to-[#3a7532]"></div>

              <div className="relative flex flex-col items-center -mt-2 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold mt-3 text-gray-800">{user?.name}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-1">
                  {user?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                </span>
              </div>

              <div className="space-y-4 mt-6">

                {/* Email (Read only) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <HiOutlineEnvelope className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium truncate">{user?.email}</span>
                    {!user?.hasPassword && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Google</span>
                    )}
                  </div>
                </div>

                {/* Name Edit */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={isEditing ? formData.name : (user?.name || "")}
                      onChange={handleEditChange}
                      disabled={!isEditing}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all ${isEditing ? "bg-white border-green-500 ring-2 ring-green-100" : "bg-gray-50 border-gray-100 text-gray-600"}`}
                    />
                  </div>
                </div>

                {/* Phone Edit */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="phone"
                      value={isEditing ? formData.phone : (user?.phone || "Chưa cập nhật")}
                      onChange={handleEditChange}
                      disabled={!isEditing}
                      placeholder="Chưa cập nhật"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all ${isEditing ? "bg-white border-green-500 ring-2 ring-green-100" : "bg-gray-50 border-gray-100 text-gray-600"}`}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveProfile}
                        className="flex-1 py-2.5 bg-[#2d5a27] text-white rounded-xl font-semibold hover:bg-[#23461f] transition-colors"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={() => { setIsEditing(false); setFormData({ name: user.name, phone: user.phone }); }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <HiOutlinePencilSquare className="w-5 h-5" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {/* Change Password (if allowed) */}
                {!!user?.hasPassword && (
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-2.5 text-[#2d5a27] font-medium hover:bg-green-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <HiOutlineLockClosed className="w-5 h-5" />
                    Đổi mật khẩu
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Right: Dashboard & Features */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions / Recent Orders Placeholder */}
            {/* Keeping existing table logic but wrapped in new design */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
                <button
                  onClick={() => navigate("/user/order")}
                  className="text-[#2d5a27] font-semibold hover:underline flex items-center gap-1"
                >
                  Xem tất cả
                  <HiOutlineTicket className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "SHIPPING"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {order.status === "DELIVERED" ? "Đã giao" :
                                order.status === "CANCELLED" ? "Đã hủy" :
                                  order.status === "SHIPPING" ? "Đang giao" :
                                    order.status === "CONFIRMED" ? "Đã xác nhận" : "Chờ xử lý"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                            {order.total.toLocaleString()}₫
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 text-sm">
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HiOutlineXMark className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold text-gray-800 mb-1">Đổi mật khẩu</h3>
              <p className="text-sm text-gray-500 mb-6">Nhập mật khẩu hiện tại và mật khẩu mới của bạn.</p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent"
                    placeholder="Ít nhất 6 ký tự"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  className="w-full py-3 bg-[#2d5a27] text-white rounded-xl font-bold hover:bg-[#23461f] transition-transform active:scale-[0.98] mt-2"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDetail;
