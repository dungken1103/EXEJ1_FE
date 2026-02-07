import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../../services/axiosConfig";
import {
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineInboxArrowDown,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineShoppingBag
} from 'react-icons/hi2';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from '../../utils/toast';
import { useAuth } from "../../contexts/AuthContext";
import SafeImage from "../../components/SafeImage";

const MySwal = withReactContent(Swal);

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const UserOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user, selectedTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { userId: user.id };
      if (selectedTab) {
        params.status = selectedTab;
      }

      const res = await axios.get(`/order/get`, { params });
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    MySwal.fire({
      title: 'Hủy đơn hàng?',
      text: "Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này:",
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Nhập lý do hủy đơn...',
      inputAttributes: {
        'aria-label': 'Nhập lý do hủy đơn'
      },
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Quay lại',
      preConfirm: (reason) => {
        if (!reason) {
          MySwal.showValidationMessage('Vui lòng nhập lý do hủy đơn');
        }
        return reason;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // result.value contains the input value
          await axios.put(`/order/${orderId}/cancel`, { reason: result.value });
          toast.success('Đã hủy đơn hàng thành công');
          fetchOrders();
        } catch (err) {
          toast.error('Lỗi', 'Không thể hủy đơn hàng');
        }
      }
    });
  };

  const handleMarkAsDelivered = (orderId) => {
    MySwal.fire({
      title: 'Đã nhận hàng?',
      text: "Xác nhận bạn đã nhận được hàng và hài lòng với sản phẩm?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: brandGreen,
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đã nhận hàng',
      cancelButtonText: 'Chưa'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`order/confirm-received/${orderId}`);
          toast.success('Cập nhật trạng thái thành công');
          fetchOrders();
        } catch (err) {
          toast.error('Lỗi', 'Không thể cập nhật trạng thái');
        }
      }
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { label: "Chờ xử lý", icon: HiOutlineClock, color: "bg-yellow-50 text-yellow-700 border-yellow-200" };
      case 'CONFIRMED':
        return { label: "Đã xác nhận", icon: HiOutlineInboxArrowDown, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case 'SHIPPING':
        return { label: "Đang giao", icon: HiOutlineTruck, color: "bg-purple-50 text-purple-700 border-purple-200" };
      case 'DELIVERED':
        return { label: "Đã giao", icon: HiOutlineCheckCircle, color: "bg-green-50 text-green-700 border-green-200" };
      case 'CANCELLED':
        return { label: "Đã hủy", icon: HiOutlineXCircle, color: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { label: status, icon: HiOutlineCube, color: "bg-gray-50 text-gray-700 border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] py-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: brandBrown }}>Đơn hàng của tôi</h1>
          <p className="text-gray-500 mt-2">Theo dõi và quản lý lịch sử mua sắm của bạn</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedTab === tab.value
                  ? "bg-[#2d5a27] text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5a27] mx-auto"></div>
              <p className="mt-4 text-gray-500">Đang tải đơn hàng...</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const status = getStatusInfo(order.status);
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full border border-gray-200 text-gray-400">
                        <HiOutlineShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Đơn hàng #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')} • {new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
                      </div>
                    </div>

                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </span>
                  </div>

                  {/* Card Body: Items Preview */}
                  <div className="p-6">
                    <div className="flex gap-4 overflow-x-auto p-2 pt-4 scrollbar-thin scrollbar-thumb-gray-200">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-20 relative group">
                          <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                            <SafeImage
                              src={item.product.image?.startsWith('http') ? item.product.image : `${import.meta.env.VITE_API_URL}${item.product.image}`}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                            {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-gray-500 text-sm">Tổng tiền thanh toán</span>
                        <p className="text-xl font-bold text-[#b91c1c]">{order.total.toLocaleString()}₫</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <HiOutlineTrash className="w-4 h-4" /> Hủy đơn
                          </button>
                        )}

                        {order.status === 'SHIPPING' && (
                          <button
                            onClick={() => handleMarkAsDelivered(order.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#2d5a27] hover:bg-[#23461f] rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" /> Đã nhận hàng
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <HiOutlineEye className="w-4 h-4" /> Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <HiOutlineShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mt-1">Danh sách đơn hàng của bạn trống</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2.5 bg-[#2d5a27] text-white rounded-xl font-medium hover:bg-[#23461f] transition-all"
              >
                Mua sắm ngay
              </button>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                  <p className="text-sm text-gray-500">Mã đơn: #{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 shadow-sm transition-all"
                >
                  <HiOutlineXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        <SafeImage
                          src={item.product.image?.startsWith('http') ? item.product.image : `${import.meta.env.VITE_API_URL}${item.product.image}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-white px-2 py-0.5 rounded border border-gray-200">SL: {item.quantity}</span>
                          <span>x {item.product.price.toLocaleString()}₫</span>
                        </div>
                        <p className="mt-2 font-bold text-[#2d5a27] text-lg">
                          {(item.product.price * item.quantity).toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{selectedOrder.total.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-[#2d5a27] font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-dashed border-gray-200 mt-2">
                    <span>Tổng cộng</span>
                    <span className="text-[#b91c1c]">{selectedOrder.total.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 shadow-sm transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOrdersPage;
