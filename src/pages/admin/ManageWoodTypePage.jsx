import React, { useState, useEffect } from "react";
import woodTypeService from "../../services/woodTypeServices";
import toast from "../../utils/toast";

const ManageWoodTypePage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await woodTypeService.getAll();
            setList(data);
        } catch (error) {
            console.error("Failed to load wood types", error);
            toast.error("Không thể tải danh sách loại gỗ");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, description: item.description || "" });
        } else {
            setEditingItem(null);
            setFormData({ name: "", description: "" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ name: "", description: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await woodTypeService.update(editingItem.id, formData);
                toast.success("Cập nhật thành công");
            } else {
                await woodTypeService.create(formData);
                toast.success("Thêm mới thành công");
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error("Save failed", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            await woodTypeService.delete(id);
            toast.success("Xóa thành công");
            fetchData();
        } catch (error) {
            console.error("Delete failed", error);
            toast.error(error.response?.data?.message || "Không thể xóa");
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2d5a27]">Quản lý Loại Gỗ</h2>
                        <p className="text-[#2d5a27] text-sm mt-1">Danh sách các loại gỗ sản phẩm</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#2d5a27] hover:bg-[#1e3f1a] text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        Thêm loại gỗ
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#2d5a27]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tên loại gỗ</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mô tả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Số lượng sản phẩm</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Đang tải...</td>
                                </tr>
                            ) : list.length > 0 ? (
                                list.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item._count?.products || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="text-[#2d5a27] hover:text-[#1e3f1a] mr-4"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">Chưa có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                        <h3 className="text-xl font-bold mb-4">{editingItem ? "Sửa loại gỗ" : "Thêm loại gỗ"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Tên loại gỗ *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2d5a27] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2d5a27] focus:outline-none"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-[#2d5a27] hover:bg-[#1e3f1a] text-white font-semibold"
                                >
                                    {editingItem ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageWoodTypePage;
