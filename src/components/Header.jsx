import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        fetchCart(parsedUser.id);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    cart.forEach((item) => {
      if (item.book.stock === 0 && item.quantity !== 1) {
        updateQuantity(item.id, 1);
      }
    });
  }, [cart]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".cart-icon")
      ) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      const res = await cartService.getCart(userId);
      if (Array.isArray(res.data)) {
        setCart(res.data);
        setSelectedItems([]);
      } else {
        setCart([]);
        setSelectedItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
      setSelectedItems([]);
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId, user.id);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;
    if (item.book.stock !== 0 && newQuantity > item.book.stock) return;

    try {
      await cartService.updateQuantity(itemId, user.id, newQuantity);
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const cartCount = cart.length;
  const cartTotal = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce(
      (sum, item) => sum + (item?.book?.price || 0) * (item?.quantity || 0),
      0
    );

  const navigateLogin = () => navigate(`/login`);
  const navigateRegister = () => navigate(`/register`);

  const handleToggleCart = () => {
    setShowCartDropdown((prev) => {
      const newState = !prev;
      if (newState && user?.id) {
        fetchCart(user.id);
      }
      return newState;
    });
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const goToCheckout = () => {
    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(item.id)
    );
    localStorage.setItem("checkout_items", JSON.stringify(selectedProducts));
    navigate(`/checkout`);
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/no-image.png";
    if (path.startsWith("http")) return path;
    return `http://localhost:3212${path}`;
  };

  return (
    <header className="flex justify-between items-center px-8 py-5 bg-[#FFE4B5] shadow-sm text-[#2F2F2F] relative">
      <div className="flex items-center space-x-3 font-bold text-2xl tracking-wide">
        <img src="/images/book-logo1.png" alt="Logo" className="w-9 h-9" />
        <span>FUHUSU</span>
      </div>

      <nav className="space-x-6 font-medium">
        <a href="/" className="hover:text-[#B84D36] transition duration-200">
          Home
        </a>
        <a href="/shop" className="hover:text-[#B84D36] transition duration-200">
          Shop
        </a>
        <a href="#about" className="hover:text-[#B84D36] transition duration-200">
          About
        </a>
        <a href="#contact" className="hover:text-[#B84D36] transition duration-200">
          Contact
        </a>
      </nav>

      <div className="flex items-center space-x-4 relative mr-10">
        {user ? (
          <>
            <div
              className="relative cursor-pointer cart-icon"
              onClick={handleToggleCart}
              aria-label="Toggle cart dropdown"
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {showCartDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-12 w-[28rem] bg-white border border-gray-200 shadow-xl rounded-xl p-6 z-50 flex flex-col max-h-[85vh]"
              >
                <h4 className="text-gray-800 font-bold text-lg mb-4 border-b border-gray-200 pb-2 select-none">
                  Giỏ hàng
                </h4>

                {cart.length > 0 ? (
                  <>
                    <ul className="flex-1 overflow-y-auto max-h-[60vh] space-y-4 pr-2">
                      {cart.map((item) => {
                        const outOfStock = item.book.stock === 0;
                        const tempPrice = item.quantity * (item.book.price || 0);
                        return (
                          <li
                            key={item.id}
                            className="grid grid-cols-[auto,80px,1fr,auto] items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                          >
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleCheckboxChange(item.id)}
                              disabled={outOfStock}
                              className="w-4 h-4 accent-yellow-500 cursor-pointer rounded focus:ring-2 focus:ring-yellow-300"
                              aria-label={`Chọn sản phẩm ${item.book.title}`}
                              title={outOfStock ? "Sản phẩm đã hết hàng" : ""}
                            />

                            <img
                              src={getImageUrl(item.book.image)}
                              alt={item.book.title}
                              className="w-20 h-20 object-cover rounded-md shadow-sm"
                            />

                            <div className="flex flex-col justify-center">
                              <p
                                className={`font-medium text-gray-800 truncate max-w-[180px] ${
                                  outOfStock ? "opacity-60 line-through" : ""
                                }`}
                                title={item.book.title}
                              >
                                {item.book.title}
                              </p>
                              {outOfStock ? (
                                <p className="text-xs text-red-500 font-medium mt-1">
                                  Hết hàng
                                </p>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-600 mt-1 font-medium">
                                    Số lượng: {item.quantity}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-0.5">
                                    Tạm tính:{" "}
                                    <span className="font-medium">
                                      {tempPrice.toLocaleString()}₫
                                    </span>
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <span className="font-semibold text-gray-800">
                                {item.book.price.toLocaleString()}₫
                              </span>
                              {!outOfStock && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    aria-label={`Giảm số lượng ${item.book.title}`}
                                    type="button"
                                  >
                                    −
                                  </button>
                                  <span className="min-w-[32px] text-center font-medium text-gray-800">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    disabled={item.quantity >= item.book.stock}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    aria-label={`Tăng số lượng ${item.book.title}`}
                                    type="button"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => deleteCartItem(item.id)}
                                className="text-red-500 hover:text-red-600 text-sm font-medium transition-all"
                                aria-label={`Xóa sản phẩm ${item.book.title}`}
                                type="button"
                              >
                                Xóa
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <p className="flex justify-between font-bold text-gray-800 text-lg mb-4">
                        <span>Tổng cộng:</span>
                        <span>{cartTotal.toLocaleString()}₫</span>
                      </p>
                      <button
                        disabled={selectedItems.length === 0}
                        onClick={goToCheckout}
                        className={`w-full py-2.5 rounded-lg font-bold text-lg transition-all duration-200 ${
                          selectedItems.length > 0
                            ? "bg-yellow-500 text-white hover:bg-yellow-600 shadow-md"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        type="button"
                      >
                        Thanh toán
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-10 text-lg">
                    Bạn chưa thêm sản phẩm nào
                  </p>
                )}
              </div>
            )}

            <span className="text-sm font-semibold">
              Hello, {user?.fullName || user?.name || user?.email}
            </span>
          </>
        ) : (
          <>
            <button
              className="text-sm text-[#2F2F2F] hover:text-[#B84D36] transition duration-200"
              onClick={navigateLogin}
            >
              Login
            </button>
            <button
              onClick={navigateRegister}
              className="text-sm px-3 py-1 border border-[#B84D36] text-[#B84D36] hover:bg-[#B84D36] hover:text-white rounded transition duration-200"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;