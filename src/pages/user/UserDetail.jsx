import React from 'react';


const UserDetail = () => {
    // Demo data
    const user = {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        balance: 1500000,
        password: '123456',
    };
    const orders = [
        { id: 'DH001', total: 350000, status: 'Đã giao', date: '2025-07-30' },
        { id: 'DH002', total: 120000, status: 'Đang xử lý', date: '2025-07-28' },
        { id: 'DH003', total: 500000, status: 'Đã hủy', date: '2025-07-20' },
    ];

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
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Số dư ví: </span>
                        <span className="text-green-600 font-bold">{user.balance.toLocaleString()} đ</span>
                        <button className="ml-2 px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm">Nạp ví</button>
                    </div>
                    <div>
                        <span className="font-semibold">Mật khẩu: </span>
                        <span>******</span>
                    </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold w-fit">Sửa thông tin</button>
            </div>

            {/* Right: Orders list */}
            <div className="md:w-2/3 w-full bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Danh sách đơn hàng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Đơn hàng</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-2 font-semibold text-gray-900">{order.id}</td>
                                    <td className="px-4 py-2 text-gray-700">{order.total.toLocaleString()} đ</td>
                                    <td className="px-4 py-2">
                                        <span className={
                                            order.status === 'Đã giao' ? 'text-green-600 font-semibold' :
                                            order.status === 'Đã hủy' ? 'text-red-500 font-semibold' :
                                            'text-yellow-600 font-semibold'
                                        }>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-500">{order.date}</td>
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