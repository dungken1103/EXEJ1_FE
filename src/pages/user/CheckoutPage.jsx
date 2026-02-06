import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import toast from "../../utils/toast";
import SafeImage from "../../components/SafeImage";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineChevronRight,
  HiOutlineArrowLeft
} from "react-icons/hi2";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    paymentMethod: "COD",
  });

  // Check authentication after loading completes
  useEffect(() => {
    if (isLoading) return; // Wait for auth context to load

    if (!isAuthenticated || !user) {
      toast.warning("Vui lòng đăng nhập để tiến hành thanh toán");
      localStorage.setItem("redirect_after_login", "/checkout");
      navigate("/login");
      return;
    }

    // Set form with user data
    setForm((f) => ({
      ...f,
      name: user.fullName || user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    }));

    const storedItems = JSON.parse(
      localStorage.getItem("checkout_items") || "[]"
    );
    setCheckoutItems(storedItems);

    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, [isLoading, isAuthenticated, user, navigate]);


  const handleProvinceChange = (e) => {
    const provinceCode = Number(e.target.value);
    setForm((f) => ({ ...f, province: provinceCode, district: "", ward: "" }));
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts || []);
        setWards([]);
      })
      .catch(console.error);
  };

  const handleDistrictChange = (e) => {
    const districtCode = Number(e.target.value);
    setForm((f) => ({ ...f, district: districtCode, ward: "" }));
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch(console.error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const getProduct = (item) => item.product || item.book || {};
  const total = checkoutItems.reduce(
    (sum, item) =>
      sum + (getProduct(item).price || 0) * (item.quantity || 0),
    0
  );

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity < 1) return;
    setCheckoutItems((prev) =>
      prev.map((item) => {
        const key = item.id || getProduct(item).id;
        return key === itemKey ? { ...item, quantity: newQuantity } : item;
      })
    );
  };

  const handlePayment = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để tiến hành thanh toán");
      navigate("/login");
      return;
    }

    if (
      !form.name?.trim() ||
      !form.phone?.trim() ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.address?.trim()
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin người nhận và địa chỉ giao hàng.");
      return;
    }
    if (checkoutItems.length === 0) {
      toast.warning("Giỏ hàng trống. Vui lòng thêm sản phẩm.");
      return;
    }

    try {
      const payload = {
        items: checkoutItems.map((item) => {
          const p = getProduct(item);
          return {
            productId: p.id,
            quantity: item.quantity || 1,
            price: p.price || 0,
          };
        }),
        payment: form.paymentMethod,
        userAddress: {
          fullName: form.name,
          email: form.email || user?.email,
          phone: form.phone,
          province:
            provinces.find((p) => p.code === Number(form.province))?.name || "",
          district:
            districts.find((d) => d.code === Number(form.district))?.name || "",
          ward: wards.find((w) => w.code === Number(form.ward))?.name || "",
          addressDetail: form.address,
        },
      };

      await orderService.createOrder(payload);

      localStorage.removeItem("checkout_items");

      for (const item of checkoutItems) {
        if (item.id) {
          try {
            await cartService.removeItem(item.id, user.id);
          } catch (_) { }
        }
      }

      toast.success("Đặt hàng thành công!", "Chúng tôi sẽ liên hệ bạn sớm.");
      window.location.href = "/";
    } catch (err) {

      console.error(err);
      toast.error("Lỗi", err.message || "Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <p className="text-gray-600 font-medium animate-pulse">Đang tải thông tin...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans text-[#2d2d2d]" style={{ backgroundColor: cream }}>
      {/* Header Breacrumb */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/cart" className="hover:text-[#2d5a27] transition-colors flex items-center gap-1">
              <HiOutlineArrowLeft className="w-4 h-4" />
              Giỏ hàng
            </Link>
            <HiOutlineChevronRight className="w-3 h-3 text-gray-300" />
            <span className="font-semibold text-[#2d5a27]">Thanh toán</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN: Shipping & Items */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">

            {/* Step 1: Shipping Info */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandGreen }}>
                  1
                </div>
                <h2 className="text-xl font-bold" style={{ color: brandBrown }}>Thông tin giao hàng</h2>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">Họ và tên</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên người nhận"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": brandGreen }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": brandGreen }}
                      required={!user}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">Số điện thoại</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="VD: 0912345678"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": brandGreen }}
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Tỉnh / Thành phố</label>
                    <div className="relative">
                      <select
                        value={form.province}
                        onChange={handleProvinceChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white"
                        style={{ "--tw-ring-color": brandGreen }}
                      >
                        <option value="">Chọn Tỉnh/TP</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                      </select>
                      <HiOutlineMapPin className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Quận / Huyện</label>
                    <div className="relative">
                      <select
                        value={form.district}
                        onChange={handleDistrictChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        style={{ "--tw-ring-color": brandGreen }}
                        disabled={!districts.length}
                      >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.code}>{d.name}</option>
                        ))}
                      </select>
                      <HiOutlineMapPin className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Phường / Xã</label>
                    <div className="relative">
                      <select
                        value={form.ward}
                        onChange={(e) => setForm((f) => ({ ...f, ward: Number(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        style={{ "--tw-ring-color": brandGreen }}
                        disabled={!wards.length}
                      >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.code}>{w.name}</option>
                        ))}
                      </select>
                      <HiOutlineMapPin className="absolute right-3 top-3.5 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700 ml-1">Địa chỉ cụ thể</label>
                  <div className="relative">
                    <HiOutlineMapPin className="absolute left-3.5 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ "--tw-ring-color": brandGreen }}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Order Items */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: brandGreen }}>
                  2
                </div>
                <h2 className="text-xl font-bold" style={{ color: brandBrown }}>Danh sách sản phẩm</h2>
                <span className="ml-auto text-sm text-gray-500">{checkoutItems.length} sản phẩm</span>
              </div>

              <ul className="divide-y divide-gray-100">
                {checkoutItems.map((item) => {
                  const p = getProduct(item);
                  const itemKey = item.id || p.id;
                  const tempPrice = (p.price || 0) * (item.quantity || 0);
                  const imgSrc = p.image?.startsWith("http") ? p.image : `${import.meta.env.VITE_API_URL || "http://localhost:3212"}${p.image}`;

                  return (
                    <li key={itemKey} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                      <div className="relative">
                        <SafeImage
                          src={imgSrc || "/images/waste_to_worth_logo.png"}
                          alt={p.name || p.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shadow-sm bg-white"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center sm:hidden shadow-md">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">{p.name || p.title}</h3>
                          <p className="font-bold whitespace-nowrap hidden sm:block" style={{ color: brandGreen }}>
                            {tempPrice.toLocaleString("vi-VN")}₫
                          </p>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                          Đơn giá: {(p.price || 0).toLocaleString("vi-VN")}₫
                        </p>

                        <div className="flex items-center justify-between sm:justify-start gap-6">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemKey, (item.quantity || 1) - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                              disabled={(item.quantity || 1) <= 1}
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-sm font-semibold">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(itemKey, (item.quantity || 1) + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                              disabled={(p.stock ?? 0) > 0 && (item.quantity || 1) >= (p.stock ?? 0)}
                            >
                              +
                            </button>
                          </div>
                          <p className="font-bold sm:hidden" style={{ color: brandGreen }}>
                            {tempPrice.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* RIGHT COLUMN: Summary & Payment */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: brandBrown }}>
                <HiOutlineCreditCard className="w-6 h-6" />
                Thanh toán
              </h2>

              {/* Order Summary */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-[#2d5a27] font-medium">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Tổng cộng</span>
                  <span className="font-bold text-2xl" style={{ color: brandGreen }}>
                    {total.toLocaleString()}₫
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 mb-8">
                <p className="font-semibold text-gray-700 mb-3">Phương thức thanh toán</p>
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === "COD"
                    ? "border-[#2d5a27] bg-[#2d5a27]/5"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={form.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#2d5a27] focus:ring-[#2d5a27]"
                    style={{ accentColor: brandGreen }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <HiOutlineTruck className="w-5 h-5" />
                      COD
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Thanh toán khi nhận hàng</p>
                  </div>
                </label>
              </div>

              {/* Action */}
              <button
                onClick={handlePayment}
                className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-[0.98]"
                style={{ backgroundColor: brandGreen }}
              >
                Đặt hàng ngay
              </button>

              <p className="text-center text-xs text-gray-400 mt-6 md:px-8">
                Bằng việc đặt hàng, bạn đồng ý với các điều khoản dịch vụ của chúng tôi.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
