import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axiosConfig";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTrashAlt,
  FaTimesCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "../../utils/toast";

const MySwal = withReactContent(Swal);

const tabs = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const mainRef = useRef(null);

  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  /* ================== API ================== */

  const fetchOrders = async () => {
    if (!user?.id) return;

    try {
      const params = { userId: user.id };
      if (selectedTab) params.status = selectedTab;

      const res = await axios.get("/order/get", { params });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedTab]);

  /* ================== ACTIONS ================== */

  const handleCancelOrder = (orderId) => {
    MySwal.fire({
      title: "Bạn chắc chắn muốn hủy đơn?",
      text: "Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Đóng",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await axios.put(`/order/${orderId}/cancel`);
        toast.success("Đã hủy", "Đơn hàng đã được hủy");
        fetchOrders();
      } catch {
        toast.error("Lỗi", "Không thể hủy đơn hàng");
      }
    });
  };

  const handleMarkAsDelivered = (orderId) => {
    MySwal.fire({
      title: "Xác nhận đã nhận hàng?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Đã nhận",
      cancelButtonText: "Đóng",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await axios.put(`/order/confirm-received/${orderId}`);
        toast.success("Thành công", "Đã xác nhận nhận hàng");
        fetchOrders();
      } catch {
        toast.error("Lỗi", "Không thể cập nhật trạng thái");
      }
    });
  };

  /* ================== UI HELPERS ================== */

  const renderOrderStatus = (status) => {
    const map = {
      PENDING: ["Chờ xử lý", <FaBox />, "bg-yellow-100 text-yellow-800"],
      CONFIRMED: ["Đã xác nhận", <FaCheckCircle />, "bg-blue-100 text-blue-800"],
      SHIPPING: ["Đang giao", <FaShippingFast />, "bg-purple-100 text-purple-800"],
      DELIVERED: ["Đã giao", <FaCheckCircle />, "bg-green-100 text-green-800"],
      CANCELLED: ["Đã hủy", <FaTimesCircle />, "bg-red-100 text-red-800"],
    };

    const [label, icon, color] = map[status] || [
      "Không rõ",
      <FaBox />,
      "bg-gray-100 text-gray-800",
    ];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        {icon} {label}
      </span>
    );
  };

  /* ================== RENDER ================== */

  return (
    <div className="min-h-screen bg-[#FFEFD5] text-[#2F2F2F]">
      <main ref={mainRef} className="p-8 space-y-6">
        <h2 className="text-2xl font-bold">Đơn hàng của bạn</h2>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  selectedTab === tab.value
                    ? "bg-[#D9A96C] text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {orders.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              Không có đơn hàng nào
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-5 flex justify-between"
            >
              <div className="space-y-1">
                <div className="font-semibold text-lg">Mã đơn #{order.id}</div>
                <div className="text-sm text-gray-500">
                  Ngày đặt:{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </div>
                <div className="text-sm">
                  Tổng tiền:{" "}
                  <span className="text-red-600 font-semibold">
                    {(order.total ?? 0).toLocaleString()}₫
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="flex flex-col items-end justify-between">
                {renderOrderStatus(order.status)}

                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="mt-3 px-4 py-2 text-sm rounded border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"
                  >
                    <FaTrashAlt /> Hủy đơn
                  </button>
                )}

                {order.status === "SHIPPING" && (
                  <button
                    onClick={() => handleMarkAsDelivered(order.id)}
                    className="mt-3 px-4 py-2 text-sm rounded border border-green-300 text-green-600 hover:bg-green-50 flex items-center gap-1"
                  >
                    <FaCheckCircle /> Đã nhận
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[800px] max-h-[75vh] flex flex-col overflow-hidden shadow-xl">
              <div className="p-6 border-b font-semibold text-lg">
                Chi tiết đơn #{selectedOrder.id}
              </div>

              <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                {selectedOrder.items?.map((item, idx) => {
                  console.log("Item:", item);
                  console.log(selectedOrder);

                  return (
                    <li key={idx} className="flex justify-between items-center border-b py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
                          alt={item.product.title}
                          className="w-10 h-10 object-cover"
                        />
                        <div className='flex flex-col'>
                          <span>{item.product.title} </span>
                          <span className="text-xs text-gray-500">Số Lượng: {item.quantity}</span>
                        </div>


                      </div>
                      <div className="flex items-center gap-4">
                        <div > Giá: <span className="text-red-600 font-semibold">{item.product.price.toLocaleString()}đ</span></div>
                      </div>


                    </li>
                  );
                })}
              </ul>

              <div className="p-4 border-t text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrdersPage;
