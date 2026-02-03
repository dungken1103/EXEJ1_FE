import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import toast from "../../utils/toast";
import SafeImage from "../../components/SafeImage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3212";
const getImageUrl = (path) => {
    if (!path) return "/images/waste_to_worth_logo.png";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
};

const ManageProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.getAll({ page, limit: LIMIT });
            const list = Array.isArray(res.data) ? res.data : [];
            setProducts(list);
            setHasMore(list.length >= LIMIT);
        } catch (err) {
            console.error("Error loading products:", err);
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleDisable = async (id) => {
        if (!window.confirm("Bạn có chắc muốn vô hiệu hóa sản phẩm này?")) return;
        try {
            await productService.disable(id);
            toast.success("Đã vô hiệu hóa sản phẩm");
            fetchProducts();
        } catch (err) {
            console.error("Error disabling product:", err);
            toast.error("Không thể vô hiệu hóa sản phẩm");
        }
    };

    const STATUS_LABELS = {
        AVAILABLE: { label: "Đang bán", color: "bg-green-100 text-green-700" },
        OUT_OF_STOCK: { label: "Hết hàng", color: "bg-yellow-100 text-yellow-700" },
        DISCONTINUED: { label: "Ngừng kinh doanh", color: "bg-gray-100 text-gray-700" },
        DISABLE: { label: "Đã vô hiệu", color: "bg-red-100 text-red-700" },
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                <Link
                    to="/admin-dashboard/products/new"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium"
                >
                    + Thêm sản phẩm mới
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">Chưa có sản phẩm nào</p>
                    <Link
                        to="/admin-dashboard/products/new"
                        className="inline-block mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                        Thêm sản phẩm đầu tiên
                    </Link>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Hình ảnh
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Tên sản phẩm
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Giá
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Tồn kho
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Trạng thái
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <SafeImage
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            {product.category && (
                                                <div className="text-sm text-gray-500">{product.category.name}</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 font-medium">
                                            {(product.price || 0).toLocaleString("vi-VN")}₫
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${STATUS_LABELS[product.status]?.color || "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {STATUS_LABELS[product.status]?.label || product.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <Link
                                                to={`/admin-dashboard/products/edit/${product.id}`}
                                                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                                            >
                                                Sửa
                                            </Link>
                                            {product.status !== "DISABLE" && (
                                                <button
                                                    onClick={() => handleDisable(product.id)}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                                                >
                                                    Vô hiệu
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="text-gray-600">Trang {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasMore}
                            className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageProductPage;
