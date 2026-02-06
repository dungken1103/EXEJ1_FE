import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import adminService from '../../services/adminService';
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCube,
  HiArrowUp,
  HiArrowDown,
  HiOutlineExclamation,
} from 'react-icons/hi';
import SafeImage from "../../components/SafeImage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!stats) return <div className="p-6">Error loading data.</div>;

  // --- Chart Data Preparation ---

  // Bar Chart: Revenue (Mock data for now, or use aggregated data if backend provided it)
  // Since backend currently returns total revenue, let's just make a mock distribution for demo
  // or use order status distribution if available.
  // Let's use Order Status distribution for a Chart.

  const orderStatusLabels = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
  };

  const statusData = {
    labels: Object.keys(stats.ordersByStatus || {}).map(k => orderStatusLabels[k] || k),
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: Object.values(stats.ordersByStatus || {}),
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)', // Yellow - Pending
          'rgba(54, 162, 235, 0.6)', // Blue - Confirmed
          'rgba(153, 102, 255, 0.6)', // Purple - Shipping
          'rgba(75, 192, 192, 0.6)', // Green - Delivered
          'rgba(255, 99, 132, 0.6)', // Red - Cancelled
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Phân bố trạng thái đơn hàng',
      },
    },
  };

  // --- Components ---

  const StatCard = ({ title, value, icon: Icon, color, subValue, subLabel }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {(subValue || subLabel) && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${subValue?.startsWith('-') ? 'text-red-500' : 'text-green-500'
            }`}>
            {subValue && (
              <>
                {subValue.startsWith('-') ? <HiArrowDown /> : <HiArrowUp />}
                <span>{subValue}</span>
              </>
            )}
            <span className="text-gray-400 font-normal ml-1">{subLabel}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Tổng quan số liệu kinh doanh</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={`${stats.totalRevenue?.toLocaleString()} ₫`}
          icon={HiOutlineCurrencyDollar}
          color="bg-emerald-500"
          subValue="+12.5%"
          subLabel="so với tháng trước"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          icon={HiOutlineShoppingCart}
          color="bg-blue-500"
          subValue={stats.pendingOrders > 0 ? `${stats.pendingOrders}` : null}
          subLabel={stats.pendingOrders > 0 ? "đơn chờ xử lý" : "đang hoạt động"}
        />
        <StatCard
          title="Khách hàng"
          value={stats.totalUsers}
          icon={HiOutlineUsers}
          color="bg-violet-500"
          subValue="+5"
          subLabel="mới trong tuần này"
        />
        <StatCard
          title="Sản phẩm"
          value={stats.totalProducts}
          icon={HiOutlineCube}
          color="bg-orange-500"
          subValue={stats.lowStockProducts > 0 ? `${stats.lowStockProducts}` : null}
          subLabel={stats.lowStockProducts > 0 ? "sắp hết hàng!" : "tồn kho ổn định"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Thống kê đơn hàng</h3>
            <div className="h-64 flex justify-center">
              <Doughnut data={statusData} options={statusOptions} />
            </div>
          </div>
        </div>

        {/* Right Column: Recent Orders & Alerts */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats.lowStockProducts > 0 && (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                  <HiOutlineExclamation className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-red-800">Cảnh báo tồn kho</h4>
                  <p className="text-sm text-red-600 mt-1">
                    Có <span className="font-bold">{stats.lowStockProducts}</span> sản phẩm sắp hết hàng (số lượng &le; 5).
                  </p>
                  <button onClick={() => window.location.href = '/admin-dashboard/products'} className="mt-3 text-xs font-bold text-red-700 hover:underline">
                    Kiểm tra ngay &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Đơn hàng mới</h3>
              <a href="/admin-dashboard/orders" className="text-sm text-violet-600 hover:underline">Xem tất cả</a>
            </div>
            <div className="divide-y divide-gray-50">
              {stats.recentOrders?.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                      {order.customer.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{order.total.toLocaleString()} ₫</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <div className="p-6 text-center text-gray-500 text-sm">Chưa có đơn hàng nào</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;