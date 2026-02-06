import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import ProductModal from "./ProductModal";
import toast from "../../utils/toast";
import SafeImage from "../../components/SafeImage";

const ManageProductPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [page, searchTerm]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Need API to support search or just simple pagination
            // Assuming productService.getProductsByName signature: (name, page, limit)
            const res = await productService.getProductsByName(searchTerm, page, 10);
            if (res.data) {
                setProducts(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to page 1 on search
        fetchProducts();
    };

    const handleOpenModal = (product = null) => {
        setActiveProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setActiveProduct(null);
        setShowModal(false);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await productService.delete(id); // Ensure delete method exists in service, assuming soft delete or disable
            toast.success("Xóa sản phẩm thành công");
            fetchProducts();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Không thể xóa sản phẩm");
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d5a27]">Quản lý Sản phẩm</h2>
                        <p className="text-[#2d5a27] text-sm mt-1">Danh sách tất cả sản phẩm trong cửa hàng</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#2d5a27] hover:bg-[#1e3f1a] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Thêm sản phẩm
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="flex justify-between items-center mb-6">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#2d5a27]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Kho</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600"></div>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0">
                                                    <SafeImage
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 max-w-[200px] truncate">{product.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category?.name || "---"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {product.price?.toLocaleString()} ₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? "bg-green-100 text-green-800" :
                                                product.stock > 0 ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-xs font-semibold ${product.status === 'DISABLE' ? 'text-red-500' : 'text-green-600'}`}>
                                                {product.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="text-[#2d5a27] hover:text-[#1e3f1a] mr-4 font-semibold"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-900 font-semibold"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Trước
                    </button>
                    <span className="text-sm text-gray-600">
                        Trang <span className="font-bold text-gray-900">{page}</span> / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <ProductModal
                    product={activeProduct}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default ManageProductPage;
