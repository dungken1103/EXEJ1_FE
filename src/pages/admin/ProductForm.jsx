import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import toast from "../../utils/toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3212";

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        woodTypeId: "",
        difficulty: "",
        dimensions: "",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const catData = await categoryService.getCategories();
                setCategories(Array.isArray(catData) ? catData : []);

                if (isEdit) {
                    const res = await productService.getById(id);
                    const product = res.data?.data ?? res.data;
                    if (product) {
                        setForm({
                            name: product.name || "",
                            slug: product.slug || "",
                            description: product.description || "",
                            price: product.price?.toString() || "",
                            stock: product.stock?.toString() || "",
                            categoryId: product.categoryId || "",
                            woodTypeId: product.woodTypeId || "",
                            difficulty: product.difficulty || "",
                            dimensions: product.dimensions || "",
                        });
                        if (product.image) {
                            setImagePreview(
                                product.image.startsWith("http")
                                    ? product.image
                                    : `${API_BASE}${product.image}`
                            );
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading data:", err);
                toast.error("Không thể tải dữ liệu");
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setForm((f) => ({ ...f, description: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.warning("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (!form.price || parseFloat(form.price) <= 0) {
            toast.warning("Vui lòng nhập giá hợp lệ");
            return;
        }
        if (!isEdit && !imageFile) {
            toast.warning("Vui lòng chọn hình ảnh sản phẩm");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("slug", form.slug.trim() || generateSlug(form.name));
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("stock", form.stock || "0");
            if (form.categoryId) formData.append("categoryId", form.categoryId);
            if (form.woodTypeId) formData.append("woodTypeId", form.woodTypeId);
            if (form.difficulty) formData.append("difficulty", form.difficulty);
            if (form.dimensions) formData.append("dimensions", form.dimensions);
            if (imageFile) formData.append("image", imageFile);

            if (isEdit) {
                await productService.update(id, formData);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                await productService.create(formData);
                toast.success("Thêm sản phẩm thành công!");
            }
            navigate("/admin-dashboard/products");
        } catch (err) {
            console.error("Error saving product:", err);
            toast.error(err.response?.data?.message || "Không thể lưu sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["link"],
            ["clean"],
        ],
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Mô hình bản đồ Việt Nam"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (URL)
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="mo-hinh-ban-do-viet-nam"
                    />
                </div>

                {/* Description - Rich Text Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả sản phẩm (HTML)
                    </label>
                    <ReactQuill
                        theme="snow"
                        value={form.description}
                        onChange={handleDescriptionChange}
                        modules={quillModules}
                        className="bg-white"
                        style={{ minHeight: "200px" }}
                    />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            min="0"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="299000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số lượng tồn kho
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            min="0"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="50"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh mục
                    </label>
                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty & Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Độ khó ghép
                        </label>
                        <select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="">-- Chọn độ khó --</option>
                            <option value="EASY">Dễ</option>
                            <option value="MEDIUM">Trung bình</option>
                            <option value="HARD">Khó</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kích thước
                        </label>
                        <input
                            type="text"
                            name="dimensions"
                            value={form.dimensions}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="25 x 35 cm"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh sản phẩm {!isEdit && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                    {imagePreview && (
                        <div className="mt-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-40 h-40 object-cover rounded-lg border"
                            />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:opacity-50"
                    >
                        {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm sản phẩm"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin-dashboard/products")}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
