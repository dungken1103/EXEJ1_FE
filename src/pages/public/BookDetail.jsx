import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import Swal from "sweetalert2";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineCube,
  HiOutlineMap,
} from "react-icons/hi2";

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

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

    if (!user) {
      const key = "checkout_items";
      const raw = localStorage.getItem(key);
      const list = Array.isArray(JSON.parse(raw || "[]")) ? JSON.parse(raw) : [];
      const existing = list.find((i) => (i.product?.id || i.productId) === product.id);
      const item = {
        productId: product.id,
        quantity: existing ? (existing.quantity || 0) + quantity : quantity,
        price: product.price,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
        },
      };
      const next = existing ? list.map((i) => ((i.product?.id || i.productId) === product.id ? item : i)) : [...list, item];
      localStorage.setItem(key, JSON.stringify(next));
      await Swal.fire({
        title: "Đã thêm vào giỏ",
        text: "Bạn có thể thanh toán ngay hoặc tiếp tục mua sắm.",
        icon: "success",
        confirmButtonColor: brandGreen,
      });
      window.dispatchEvent(new Event("guestCartUpdated"));
      return;
    }

    try {
      await cartService.addToCart(user.id, product.id, quantity);
      if (refreshCartCount) refreshCartCount();
      await Swal.fire({
        title: "Đã thêm vào giỏ hàng",
        icon: "success",
        confirmButtonColor: brandGreen,
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      await Swal.fire({
        title: "Không thêm được vào giỏ",
        text: "Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonColor: brandGreen,
      });
    }
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
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
          Quay lại cửa hàng
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Ảnh */}
            <figure className="aspect-square lg:aspect-auto lg:min-h-[400px] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </figure>

            {/* Thông tin */}
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

              {product.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">Mô tả</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <dl className="mt-6 space-y-2">
                {product.woodType && (
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-24 flex-shrink-0">Chất liệu:</dt>
                    <dd className="font-medium text-gray-800">{product.woodType.name}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-24 flex-shrink-0">Kích thước:</dt>
                    <dd className="font-medium text-gray-800">{product.dimensions}</dd>
                  </div>
                )}
                {product.difficulty && (
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-24 flex-shrink-0">Độ khó ghép:</dt>
                    <dd className="font-medium text-gray-800">
                      {DIFFICULTY_LABEL[product.difficulty] || product.difficulty}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex items-center gap-4">
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
    </div>
  );
};

export default BookDetail;
