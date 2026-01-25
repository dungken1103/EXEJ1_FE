import React from 'react';

const recentOrders = [
  { id: 'ORD-1001', customer: 'Nguyen Van A', date: '2024-06-01', total: '$120.00' },
  { id: 'ORD-1002', customer: 'Tran Thi B', date: '2024-06-02', total: '$89.50' },
  { id: 'ORD-1003', customer: 'Le Van C', date: '2024-06-03', total: '$45.00' },
  { id: 'ORD-1004', customer: 'Pham D', date: '2024-06-04', total: '$210.00' },
  { id: 'ORD-1005', customer: 'Hoang E', date: '2024-06-05', total: '$67.25' },
];

const AdminDashboardPage = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-5">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Customers & Orders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customers */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <div className="flex flex-col items-center justify-center flex-1 ">
                <div className="bg-violet-100 p-3 rounded-xl mb-2">
                  <svg className="w-8 h-8 text-violet-600 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5" /></svg>
                </div>
                <div className="text-gray-500 text-base font-medium mb-1">Customers</div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">3,782</div>
                <div className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  11.01%
                </div>
              </div>
            </div>
            {/* Orders */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="bg-violet-100 p-3 rounded-xl mb-2">
                  <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" /></svg>
                </div>
                <div className="text-gray-500 text-base font-medium mb-1">Orders</div>
                <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">5,359</div>
                <div className="text-red-500 text-sm font-semibold flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  9.05%
                </div>
              </div>
            </div>
          </div>
          {/* Monthly Sales Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="mb-3 font-bold text-lg text-gray-900">Monthly Sales</div>
            <div className="w-full h-44">
              <canvas id="monthly-sales-bar-chart" className="w-full h-full"></canvas>
            </div>
          </div>
        </div>
        {/* RIGHT COLUMN: Recent Orders */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col min-h-[220px] h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-lg text-gray-900">Recent Orders</div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase">
                  <th className="py-2 px-2 text-left font-semibold">Order ID</th>
                  <th className="py-2 px-2 text-left font-semibold">Customer</th>
                  <th className="py-2 px-2 text-left font-semibold">Date</th>
                  <th className="py-2 px-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-2 font-medium text-gray-900">{order.id}</td>
                    <td className="py-2 px-2 text-gray-700">{order.customer}</td>
                    <td className="py-2 px-2 text-gray-500">{order.date}</td>
                    <td className="py-2 px-2 text-right font-bold text-violet-700">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Statistics Line Chart */}
      <div className="bg-white rounded-2xl shadow p-4 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
          <div>
            <div className="font-bold text-lg text-gray-900">Statistics</div>
            <div className="text-gray-500 text-sm">Target you’ve set for each month</div>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button className="px-3 py-1 rounded-lg bg-violet-100 text-violet-700 font-semibold text-xs focus:outline-none">Overview</button>
            <button className="px-3 py-1 rounded-lg text-gray-500 font-semibold text-xs focus:outline-none">Sales</button>
            <button className="px-3 py-1 rounded-lg text-gray-500 font-semibold text-xs focus:outline-none">Revenue</button>
            <div className="ml-2 flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-xs text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12z" /></svg>
              <span>Jul 31, 2025 - Aug 6, 2025</span>
            </div>
          </div>
        </div>
        <div className="w-full h-56">
          <canvas id="statistics-line-chart" className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;