import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import productService from "../services/productService";
import { useAuth } from "../contexts/AuthContext";
import useDebounce from "../hooks/useDebounce";
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3212";
const getImageUrl = (path) => {
  if (!path) return "/images/no-image.png";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/shop", label: "Cửa hàng" },
  { to: "/about", label: "Về chúng tôi" },
  { to: "/contact", label: "Liên hệ" },
];

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [guestCart, setGuestCart] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const readGuestCart = () => {
    try {
      const raw = localStorage.getItem("checkout_items");
      const list = raw ? JSON.parse(raw) : [];
      setGuestCart(Array.isArray(list) ? list : []);
    } catch {
      setGuestCart([]);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCart(user.id);
    else readGuestCart();
  }, [user?.id]);

  useEffect(() => {
    if (!user && cartOpen) readGuestCart();
  }, [cartOpen, user]);

  useEffect(() => {
    const onGuestCartUpdate = () => { if (!user) readGuestCart(); };
    window.addEventListener("storage", onGuestCartUpdate);
    window.addEventListener("guestCartUpdated", onGuestCartUpdate);
    return () => {
      window.removeEventListener("storage", onGuestCartUpdate);
      window.removeEventListener("guestCartUpdated", onGuestCartUpdate);
    };
  }, [user]);

  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const res = await cartService.getCart(userId);
      const data = res.data?.data ?? res.data;
      const items = Array.isArray(data) ? data : [];
      setCart(items);
      setSelectedItems([]);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
      setSelectedItems([]);
    }
  };

  const deleteCartItem = async (itemId) => {
    if (!user?.id) return;
    try {
      await cartService.removeItem(itemId, user.id);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user?.id || newQuantity < 1) return;
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;
    const prod = item.product || item.book;
    if (!prod) return;
    if (prod.stock !== 0 && newQuantity > prod.stock) return;
    try {
      await cartService.updateQuantity(itemId, user.id, newQuantity);
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const getProduct = (item) => item.product || item.book || {};
  const cartCount = user ? cart.length : guestCart.length;
  const cartTotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const p = getProduct(item);
      return sum + (p?.price || 0) * (item?.quantity || 0);
    }, 0);
  const guestCartTotal = guestCart.reduce(
    (sum, item) => sum + (getProduct(item).price || 0) * (item.quantity || 0),
    0
  );

  const handleToggleCart = () => {
    setUserOpen(false);
    setSearchOpen(false);
    setMobileNavOpen(false);
    setCartOpen((prev) => {
      const next = !prev;
      if (next && user?.id) fetchCart(user.id);
      return next;
    });
  };

  const handleToggleUser = () => {
    setCartOpen(false);
    setSearchOpen(false);
    setMobileNavOpen(false);
    setUserOpen((prev) => !prev);
  };

  const handleToggleMobileNav = () => {
    setCartOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
    setMobileNavOpen((prev) => !prev);
  };

  const handleToggleSearch = () => {
    setCartOpen(false);
    setUserOpen(false);
    setMobileNavOpen(false);
    setSearchOpen((prev) => {
      const next = !prev;
      if (!next) {
        setSearchQuery("");
        setSearchResults([]);
      }
      return next;
    });
  };

  const runSearch = useCallback(async (q) => {
    const term = (q || "").trim();
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await productService.search(term, 1, 10);
      const data = res.data?.data ?? res.data;
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    runSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchOpen, runSearch]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const goToCheckout = () => {
    const selectedProducts = cart.filter((item) => selectedItems.includes(item.id));
    localStorage.setItem("checkout_items", JSON.stringify(selectedProducts));
    navigate("/checkout");
    setCartOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
  };

  // Overlay + sidebar panel component
  const Drawer = ({ open, onClose, side = "right", children, title }) => (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 ${side === "right" ? "right-0" : "left-0"} h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold" style={{ color: brandBrown }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Đóng"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );

  return (
    <header
      className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 shadow-sm sticky top-0 z-30"
      style={{ backgroundColor: "#f5f0e6", color: brandBrown }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-xl md:text-2xl tracking-wide"
      >
        <img
          src="/images/waste_to_worth_logo.png"
          alt="Waste To Worth"
          className="w-10 h-10 object-contain"
        />
        <span className="hidden sm:inline font-brand">Waste To Worth</span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 font-medium text-[#2d2d2d]">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="hover:opacity-80 transition"
            style={{ color: "inherit" }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right: Search, Cart, User (desktop); Search + Hamburger (mobile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleToggleSearch}
          className="p-2 rounded-full hover:bg-white/60 transition"
          aria-label="Tìm kiếm"
          title="Tìm kiếm"
        >
          <HiOutlineMagnifyingGlass className="w-6 h-6" style={{ color: brandBrown }} />
        </button>

        {/* Cart & User: desktop only; mobile dùng trong menu */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCart}
            className="relative p-2 rounded-full hover:bg-white/60 transition"
            aria-label="Giỏ hàng"
            title="Giỏ hàng"
          >
            <HiOutlineShoppingCart className="w-6 h-6" style={{ color: brandBrown }} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={handleToggleUser}
            className="p-2 rounded-full hover:bg-white/60 transition"
            aria-label="Tài khoản"
            title="Tài khoản"
          >
            <HiOutlineUser className="w-6 h-6" style={{ color: brandBrown }} />
          </button>
        </div>

        {/* Hamburger - mobile only */}
        <button
          type="button"
          onClick={handleToggleMobileNav}
          className="md:hidden p-2 rounded-lg hover:bg-white/60 transition"
          aria-label="Menu"
        >
          <HiOutlineBars3 className="w-6 h-6" style={{ color: brandBrown }} />
        </button>
      </div>

      {/* Search sidebar */}
      <Drawer open={searchOpen} onClose={() => setSearchOpen(false)} side="right" title="Tìm kiếm">
        <div className="p-4 flex flex-col h-full">
          <div className="relative mb-4">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#2d5a27] focus:border-transparent"
              autoFocus
              aria-label="Nhập từ khóa tìm kiếm"
            />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            {searchLoading ? (
              <p className="text-center text-gray-500 py-8">Đang tìm...</p>
            ) : searchQuery.trim().length < 2 ? (
              <p className="text-center text-gray-400 py-8">Nhập ít nhất 2 ký tự để tìm kiếm.</p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/book/${p.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                    >
                      <img
                        src={getImageUrl(p.image)}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: brandGreen }}>
                          {(p.price || 0).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Drawer>

      {/* Cart sidebar */}
      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} side="right" title="Giỏ hàng">
        <div className="p-4">
          {!user && guestCart.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p className="mb-4">Chưa có sản phẩm. Thêm từ trang sản phẩm để đặt hàng (không cần đăng nhập).</p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2 rounded-xl text-white font-medium"
                style={{ backgroundColor: brandGreen }}
                onClick={() => setCartOpen(false)}
              >
                Xem cửa hàng
              </Link>
            </div>
          ) : !user && guestCart.length > 0 ? (
            <>
              <ul className="space-y-4">
                {guestCart.map((item) => {
                  const p = getProduct(item);
                  const name = p?.name ?? p?.title ?? "Sản phẩm";
                  const tempPrice = (p?.price || 0) * (item?.quantity || 0);
                  return (
                    <li key={p?.id || item.productId} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <img src={getImageUrl(p?.image)} alt={name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{name}</p>
                        <p className="text-sm text-gray-600 mt-1">{(p?.price || 0).toLocaleString("vi-VN")}₫ × {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1">{tempPrice.toLocaleString("vi-VN")}₫</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="flex justify-between font-bold text-gray-800 mb-4">
                  <span>Tổng:</span>
                  <span>{guestCartTotal.toLocaleString("vi-VN")}₫</span>
                </p>
                <button
                  type="button"
                  onClick={() => { setCartOpen(false); navigate("/checkout"); }}
                  className="w-full py-3 rounded-xl font-semibold text-white transition"
                  style={{ backgroundColor: brandGreen }}
                >
                  Thanh toán (khách)
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">Đặt hàng không cần đăng nhập</p>
              </div>
            </>
          ) : user && cart.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Bạn chưa thêm sản phẩm nào.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {cart.map((item) => {
                  const p = getProduct(item);
                  const outOfStock = (p?.stock ?? 0) === 0;
                  const tempPrice = (p?.price || 0) * (item?.quantity || 0);
                  const name = p?.name ?? p?.title ?? "Sản phẩm";
                  return (
                    <li
                      key={item.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <img
                        src={getImageUrl(p?.image)}
                        alt={name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-gray-800 truncate ${
                            outOfStock ? "opacity-60 line-through" : ""
                          }`}
                        >
                          {name}
                        </p>
                        {outOfStock ? (
                          <p className="text-xs text-red-500 font-medium mt-1">Hết hàng</p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 mt-1">
                              Số lượng: {item.quantity} · {(p?.price || 0).toLocaleString("vi-VN")}₫
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center text-sm font-bold"
                              >
                                −
                              </button>
                              <span className="min-w-[28px] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={(p?.stock ?? 0) > 0 && item.quantity >= (p?.stock ?? 0)}
                                className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center text-sm font-bold"
                              >
                                +
                              </button>
                            </div>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteCartItem(item.id)}
                          className="text-red-500 text-sm font-medium mt-1 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <span className="font-semibold text-gray-800">
                          {tempPrice.toLocaleString("vi-VN")}₫
                        </span>
                        {!outOfStock && (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="w-4 h-4 rounded cursor-pointer"
                            style={{ accentColor: brandGreen }}
                            aria-label={`Chọn ${name}`}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="flex justify-between font-bold text-gray-800 mb-4">
                  <span>Tổng:</span>
                  <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
                </p>
                <button
                  type="button"
                  disabled={selectedItems.length === 0}
                  onClick={goToCheckout}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  style={{ backgroundColor: brandGreen }}
                >
                  Thanh toán
                </button>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* User sidebar */}
      <Drawer open={userOpen} onClose={() => setUserOpen(false)} side="right" title="Tài khoản">
        <div className="p-4">
          {user ? (
            <div className="space-y-2">
              <div className="py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">
                  {user.fullName || user.name || user.email}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Link
                to="/userdetail"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                onClick={() => setUserOpen(false)}
              >
                <HiOutlineUserCircle className="w-5 h-5" style={{ color: brandGreen }} />
                <span>Thông tin tài khoản</span>
              </Link>
              <Link
                to="/user/order"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                onClick={() => setUserOpen(false)}
              >
                <HiOutlineClipboardDocumentList className="w-5 h-5" style={{ color: brandGreen }} />
                <span>Đơn hàng của tôi</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/login"
                className="block w-full py-3 rounded-xl text-center font-semibold border-2 transition"
                style={{ borderColor: brandBrown, color: brandBrown }}
                onClick={() => setUserOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="block w-full py-3 rounded-xl text-center font-semibold text-white transition"
                style={{ backgroundColor: brandGreen }}
                onClick={() => setUserOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </Drawer>

      {/* Mobile nav sidebar */}
      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        side="left"
        title="Menu"
      >
        <nav className="p-4 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition"
              style={{ color: brandBrown }}
              onClick={() => setMobileNavOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-200 mt-4 pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => { setMobileNavOpen(false); setCartOpen(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-medium"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              Giỏ hàng {cartCount > 0 && `(${cartCount})`}
            </button>
            <button
              type="button"
              onClick={() => { setMobileNavOpen(false); setUserOpen(true); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-medium"
            >
              <HiOutlineUser className="w-5 h-5" />
              Tài khoản
            </button>
          </div>
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
