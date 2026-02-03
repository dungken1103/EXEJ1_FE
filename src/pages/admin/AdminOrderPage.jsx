import React, { useEffect, useState } from 'react';
import axios from "../../services/axiosConfig";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from '../../utils/toast';
import {
  FaEye,
  FaShippingFast,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

/* ================== CONSTANT ================== */

const COLORS = {
  green: "#2d5a27",
  brown: "#5D4E37",
  cream: "#f8f5f0",
  creamDark: "#ebe5dc",
  danger: "#7a3e2e",
};

const TABS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const statusMap = {
  PENDING: {
    label: "Chờ xử lý",
    icon: <FaBox />,
    className: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: <FaCheckCircle />,
    className: "bg-blue-100 text-blue-800",
  },
  SHIPPING: {
    label: "Đang giao",
    icon: <FaShippingFast />,
    className: "bg-purple-100 text-purple-800",
  },
  DELIVERED: {
    label: "Đã giao",
    icon: <FaCheckCircle />,
    className: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: <FaTimesCircle />,
    className: "bg-red-100 text-red-800",
  },
  default: {
    label: "Không rõ",
    icon: <FaBox />,
    className: "bg-gray-100 text-gray-700",
  },
};

/* ================== COMPONENT ================== */

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  /* ===== LOGIC GIỮ NGUYÊN ===== */

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/admin/order/get`, {
        params: { status: filterStatus },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    }
  };

  const handleApprove = async (orderId) => {
    const result = await MySwal.fire({
      title: 'Phê duyệt đơn hàng?',
      text: 'Bạn có chắc muốn phê duyệt đơn hàng này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Phê duyệt',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(`/admin/order/${orderId}/approve`);
        if (response.status === 200) {
          toast.success('Thành công', 'Đơn hàng đã được phê duyệt.');
          fetchOrders();
        }
      } catch (error) {
        toast.error('Lỗi', 'Không thể phê duyệt đơn hàng.');
      }
    }
  };

  const handleCancel = async (orderId) => {
    const result = await MySwal.fire({
      title: 'Hủy đơn hàng?',
      text: 'Bạn có chắc muốn hủy đơn hàng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Quay lại',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.put(`/order/${orderId}/cancel`);
        if (res.status === 200) {
          toast.success('Đã hủy', 'Đơn hàng đã bị hủy.');
          fetchOrders();
        }
      } catch (err) {
        toast.error('Lỗi', 'Không thể hủy đơn hàng.');
      }
    }
  };

  const handleAssigned = async (orderId) => {
    const result = await MySwal.fire({
      title: 'Giao đơn hàng?',
      text: 'Bạn có chắc muốn giao đơn này cho bên vận chuyển?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Giao hàng',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.put(`admin/order/${orderId}/assign`);
        if (res.status === 200) {
          toast.success('Thành công', 'Đơn đã được giao cho bên vận chuyển.');
          fetchOrders();
        }
      } catch (err) {
        toast.error('Lỗi', 'Không thể giao đơn hàng.');
      }
    }
  };

  const handleView = (orderId) => {
    navigate(`/admin/order/detail/${orderId}`);
  };

  /* ================== UI ================== */

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d5a27]">
          Quản lý đơn hàng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi và xử lý các đơn hàng trong hệ thống
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filterStatus === tab.value
                ? "text-white shadow"
                : "bg-white border text-gray-600 hover:bg-[#f8f5f0]"
              }`}
            style={filterStatus === tab.value ? { backgroundColor: COLORS.green } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#ebe5dc] text-[#5D4E37]">
            <tr>
              <th className="px-4 py-3 text-left">Mã đơn</th>
              <th className="px-4 py-3 text-left">Người nhận</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => {
              const address = order.userAddress;
              const status = statusMap[order.status] || statusMap.default;

              return (
                <tr
                  key={order.id}
                  className="border-t hover:bg-[#f8f5f0] transition"
                >
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3 font-medium">{address.fullName}</td>
                  <td className="px-4 py-3 text-center">{address.phone}</td>
                  <td className="px-4 py-3">
                    {`${address.addressDetail}, ${address.ward}, ${address.district}, ${address.province}`}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[#7a3e2e] font-semibold whitespace-nowrap">
                    {order.total?.toLocaleString()} ₫
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <IconBtn onClick={() => handleView(order.id)}>
                        <FaEye />
                      </IconBtn>

                      {order.status === "PENDING" && (
                        <>
                          <IconBtn green onClick={() => handleApprove(order.id)}>
                            <FaCheckCircle />
                          </IconBtn>
                          <IconBtn danger onClick={() => handleCancel(order.id)}>
                            <FaTimesCircle />
                          </IconBtn>
                        </>
                      )}

                      {order.status === "CONFIRMED" && (
                        <IconBtn green onClick={() => handleAssigned(order.id)}>
                          <FaShippingFast />
                        </IconBtn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================== SMALL COMPONENT ================== */

const IconBtn = ({ children, onClick, green, danger }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition ${
      danger
        ? "bg-red-100 text-red-700 hover:bg-red-200"
        : green
        ? "bg-green-100 text-green-700 hover:bg-green-200"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

export default AdminOrderPage;
