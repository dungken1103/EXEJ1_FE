import React from "react";
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaBox } from "react-icons/fa";
import SafeImage from "../../components/SafeImage";

const AdminOrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const { userAddress, items, total, status, payment } = order;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f8f5f0]">
                    <div>
                        <h2 className="text-xl font-bold text-[#2d5a27]">Chi tiết đơn hàng</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500">Mã đơn: <span className="font-mono font-medium text-gray-700">#{order.id}</span></p>
                            <button
                                onClick={() => navigator.clipboard.writeText(order.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
                                title="Sao chép mã đơn hàng"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Customer Info Card */}
                    <div className="bg-white border boundary-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm uppercase font-bold text-gray-400 mb-3 flex items-center gap-2">
                            <FaUser /> Thông tin khách hàng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <FaUser size={12} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Họ và tên</p>
                                    <p className="font-medium text-gray-900">{userAddress?.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <FaPhone size={12} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Số điện thoại</p>
                                    <p className="font-medium text-gray-900">{userAddress?.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <FaMapMarkerAlt size={12} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Địa chỉ giao hàng</p>
                                    <p className="font-medium text-gray-900">
                                        {userAddress?.addressDetail}, {userAddress?.ward}, {userAddress?.district}, {userAddress?.province}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border boundary-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FaCreditCard />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-700">Phương thức thanh toán</h3>
                                <p className="text-xs text-blue-600 font-medium">{payment || "COD"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Trạng thái</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold 
                  ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                    status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                        status === 'SHIPPING' ? 'bg-purple-100 text-purple-700' :
                                            status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'}`}>
                                {status}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm uppercase font-bold text-gray-400 mb-3 flex items-center gap-2">
                            <FaBox /> Sản phẩm ({items?.length || 0})
                        </h3>
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Sản phẩm</th>
                                        <th className="px-4 py-3 font-medium text-center">SL</th>
                                        <th className="px-4 py-3 font-medium text-right">Giá</th>
                                        <th className="px-4 py-3 font-medium text-right">Tổng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items?.map((item, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 flex-shrink-0">
                                                        <SafeImage
                                                            src={item.product?.image}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover rounded-md border"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{item.product?.name}</p>
                                                        <p className="text-xs text-gray-500">{item.product?.category?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-500">{item.price?.toLocaleString()} ₫</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">{(item.price * item.quantity)?.toLocaleString()} ₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-right font-bold text-gray-600">Tổng cộng:</td>
                                        <td className="px-4 py-3 text-right font-bold text-[#2d5a27] text-lg">{total?.toLocaleString()} ₫</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderModal;
