import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import {
  HiOutlineMap,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
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
const creamDark = "#ebe5dc";

const LIMIT = 12;

const ShopPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initCategoryId = queryParams.get("categoryId") || "";
  const initPage = Number.parseInt(queryParams.get("page"), 10) || 1;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "AVAILABLE",
    categoryId: initCategoryId,
    limit: LIMIT,
    page: initPage,
  });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    document.title = "Cửa hàng mô hình bản đồ gỗ | Waste To Worth";
    return () => { document.title = "Waste To Worth"; };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productService.getAll(filters);
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);
        setHasMore(list.length >= LIMIT);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  const handleCategory = (categoryId) => {
    const next = { ...filters, categoryId: categoryId || undefined, page: 1 };
    setFilters(next);
    const params = new URLSearchParams();
    if (next.categoryId) params.set("categoryId", next.categoryId);
    navigate(`/shop?${params.toString()}`);
  };

  const handlePage = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div
      className="min-h-screen text-[#2d2d2d] antialiased"
      style={{ backgroundColor: cream }}
    >
      {/* SEO: structured content */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: brandBrown }}>
            Cửa hàng mô hình bản đồ gỗ
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Khám phá bản đồ Việt Nam 3D từ gỗ quý tái chế — từ cơ bản đến chi tiết 63 tỉnh thành.
            Chọn danh mục bên dưới hoặc xem tất cả sản phẩm.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Danh mục */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold flex items-center gap-2" style={{ color: brandBrown }}>
                  <HiOutlineMap className="w-5 h-5" />
                  Danh mục
                </h2>
              </div>
              <nav className="p-2">
                <button
                  type="button"
                  onClick={() => handleCategory("")}
                  className={`block w-full text-left px-4 py-3 rounded-xl mb-1 transition ${!filters.categoryId
                      ? "text-white font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                  style={!filters.categoryId ? { backgroundColor: brandGreen } : {}}
                >
                  Tất cả sản phẩm
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategory(cat.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl mb-1 transition ${filters.categoryId === cat.id
                        ? "text-white font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                    style={filters.categoryId === cat.id ? { backgroundColor: brandGreen } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main: Danh sách sản phẩm */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 h-80 animate-pulse"
                    style={{ backgroundColor: creamDark }}
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <section className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <HiOutlineShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h2>
                <p className="text-gray-500 mb-6">
                  Danh mục này đang cập nhật. Bạn có thể xem tất cả sản phẩm.
                </p>
                <button
                  type="button"
                  onClick={() => handleCategory("")}
                  className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-95"
                  style={{ backgroundColor: brandGreen }}
                >
                  Xem tất cả
                </button>
              </section>
            ) : (
              <>
                <section
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                  aria-label="Danh sách sản phẩm"
                >
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-square bg-gray-100">
                        <SafeImage
                          src={getImageUrl(p.image)}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 truncate" style={{ color: brandBrown }}>
                          {p.name}
                        </h3>
                        {p.category && (
                          <p className="text-sm text-gray-500 mt-1">{p.category.name}</p>
                        )}
                        <p className="text-base font-bold mt-2" style={{ color: brandGreen }}>
                          {(p.price || 0).toLocaleString("vi-VN")}₫
                        </p>
                        <p className="text-sm mt-1">
                          {p.stock > 0 ? (
                            <span className="text-gray-600">Còn {p.stock} sản phẩm</span>
                          ) : (
                            <span className="text-red-500 font-medium">Hết hàng</span>
                          )}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-medium mt-2" style={{ color: brandGreen }}>
                          Xem chi tiết
                          <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </section>

                {/* Pagination */}
                <nav
                  className="flex justify-center items-center gap-2 mt-8"
                  aria-label="Phân trang"
                >
                  <button
                    type="button"
                    onClick={() => handlePage(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-gray-600 font-medium">
                    Trang {filters.page}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePage(filters.page + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Sau
                  </button>
                </nav>
              </>
            )}
          </main>
        </div>
      </article>
    </div>
  );
};

export default ShopPage;
