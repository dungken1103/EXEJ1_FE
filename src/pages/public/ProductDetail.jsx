import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import toast from "../../utils/toast";
import parse from "html-react-parser";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineCube,
  HiOutlineMap,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import SafeImage from "../../components/SafeImage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3212";
const getImageUrl = (path) => {
  if (!path) return "/images/waste_to_worth_logo.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";

const DIFFICULTY_LABEL = { EASY: "Dễ", MEDIUM: "Trung bình", HARD: "Khó" };

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Waste To Worth`;
      return () => { document.title = "Waste To Worth"; };
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getById(id);
        const data = res.data?.data ?? res.data;
        if (data?.id) setProduct(data);
        else setProduct(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const increaseQuantity = () => {
    if (!product) return;
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Require authentication - show modal if not logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      await cartService.addToCart(user.id, product.id, quantity);
      if (refreshCart) refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Không thêm được vào giỏ. Vui lòng thử lại. Error: " + err);
    }
  };

  const handleLoginRedirect = () => {
    // Save current product to localStorage so user can return after login
    localStorage.setItem("redirect_after_login", window.location.pathname);
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    localStorage.setItem("redirect_after_login", window.location.pathname);
    navigate("/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: cream }}>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: cream }}>
        <h1 className="text-xl font-bold text-gray-700 mb-4">Không tìm thấy sản phẩm</h1>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
          style={{ backgroundColor: brandGreen }}
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Về cửa hàng
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen text-[#2d2d2d] antialiased" style={{ backgroundColor: cream }}>
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Quay lại cửa hàng
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            <figure className="aspect-square lg:aspect-auto lg:min-h-[400px] bg-gray-100 rounded-xl overflow-hidden">
              <SafeImage
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </figure>

            <div>
              <header>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: brandBrown }}>
                  {product.name}
                </h1>
                {product.category && (
                  <Link
                    to={`/shop?categoryId=${product.category.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium"
                    style={{ color: brandGreen }}
                  >
                    <HiOutlineMap className="w-4 h-4" />
                    {product.category.name}
                  </Link>
                )}
              </header>

              <div className="mt-6 flex items-center gap-4">
                <p className="text-2xl font-bold" style={{ color: brandGreen }}>
                  {(product.price || 0).toLocaleString("vi-VN")}₫
                </p>
                <p className="text-sm">
                  {outOfStock ? (
                    <span className="text-red-500 font-medium">Hết hàng</span>
                  ) : (
                    <span className="text-gray-600">Còn {product.stock} sản phẩm</span>
                  )}
                </p>
              </div>

              {!outOfStock && (
                <>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-gray-700 font-medium">Số lượng:</span>
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => {
                          let val = Number.parseInt(e.target.value, 10) || 1;
                          if (val < 1) val = 1;
                          if (val > product.stock) val = product.stock;
                          setQuantity(val);
                        }}
                        className="w-14 text-center border-x border-gray-200 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-inset"
                        style={{ ["--tw-ring-color"]: brandGreen }}
                      />
                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition hover:opacity-95 shadow-md"
                    style={{ backgroundColor: brandGreen }}
                  >
                    <HiOutlineShoppingBag className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </button>
                </>
              )}

              {outOfStock && (
                <button
                  type="button"
                  disabled
                  className="mt-6 px-8 py-4 rounded-xl font-semibold text-gray-400 bg-gray-100 cursor-not-allowed"
                >
                  Hết hàng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Section */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "specs"
                ? "text-white border-b-2"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              style={activeTab === "specs" ? { backgroundColor: brandGreen, borderColor: brandGreen } : {}}
            >
              <HiOutlineClipboardDocumentList className="w-5 h-5" />
              Thông số chi tiết
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${activeTab === "description"
                ? "text-white border-b-2"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              style={activeTab === "description" ? { backgroundColor: brandGreen, borderColor: brandGreen } : {}}
            >
              <HiOutlineDocumentText className="w-5 h-5" />
              Mô tả sản phẩm
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === "specs" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-6" style={{ color: brandBrown }}>
                  Thông số kỹ thuật
                </h2>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50 w-1/3">Tên sản phẩm</td>
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                      </tr>
                      {product.category && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Danh mục</td>
                          <td className="px-4 py-3 text-gray-800">{product.category.name}</td>
                        </tr>
                      )}
                      {product.woodType && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Chất liệu gỗ</td>
                          <td className="px-4 py-3 text-gray-800">{product.woodType.name}</td>
                        </tr>
                      )}
                      {product.dimensions && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Kích thước</td>
                          <td className="px-4 py-3 text-gray-800">{product.dimensions}</td>
                        </tr>
                      )}
                      {product.difficulty && (
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Độ khó lắp ráp</td>
                          <td className="px-4 py-3 text-gray-800">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.difficulty === "EASY"
                                ? "bg-green-100 text-green-700"
                                : product.difficulty === "MEDIUM"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {DIFFICULTY_LABEL[product.difficulty] || product.difficulty}
                            </span>
                          </td>
                        </tr>
                      )}
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Giá bán</td>
                        <td className="px-4 py-3 font-bold" style={{ color: brandGreen }}>
                          {(product.price || 0).toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50">Tình trạng</td>
                        <td className="px-4 py-3">
                          {product.stock > 0 ? (
                            <span className="text-green-600 font-medium">Còn hàng ({product.stock} sản phẩm)</span>
                          ) : (
                            <span className="text-red-500 font-medium">Hết hàng</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "description" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-6" style={{ color: brandBrown }}>
                  Mô tả sản phẩm
                </h2>
                {product.description ? (
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {parse(product.description)}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <section className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-semibold"
            style={{ color: brandGreen }}
          >
            <HiOutlineCube className="w-5 h-5" />
            Xem thêm sản phẩm khác
          </Link>
        </section>
      </article>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${brandGreen}15` }}
              >
                <HiOutlineUserCircle className="w-12 h-12" style={{ color: brandGreen }} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-3" style={{ color: brandBrown }}>
              Đăng nhập để mua hàng
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8">
              Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.
              Đăng nhập ngay để tiếp tục mua sắm!
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: brandGreen }}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="w-full py-3 px-6 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: brandGreen, color: brandGreen }}
              >
                Đăng ký tài khoản mới
              </button>
            </div>

            {/* Continue browsing */}
            <p className="text-center mt-6 text-sm text-gray-500">
              hoặc{" "}
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="font-medium hover:underline"
                style={{ color: brandGreen }}
              >
                tiếp tục xem sản phẩm
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
