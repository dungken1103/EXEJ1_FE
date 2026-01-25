import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    if (storedUser)
      setForm((f) => ({
        ...f,
        name: storedUser.fullName || storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
      }));

    const storedItems = JSON.parse(
      localStorage.getItem("checkout_items") || "[]"
    );
    setCheckoutItems(storedItems);

    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

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
    const isGuest = !user;
    const paymentMethod = isGuest ? "COD" : form.paymentMethod;

    if (
      !form.name?.trim() ||
      !form.phone?.trim() ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.address?.trim()
    ) {
      alert("Vui lòng điền đầy đủ thông tin người nhận và địa chỉ giao hàng.");
      return;
    }
    if (isGuest && !form.email?.trim()) {
      alert("Vui lòng nhập email để nhận xác nhận đơn hàng.");
      return;
    }
    if (checkoutItems.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm.");
      return;
    }

    try {
      const payload = {
        userId: isGuest ? null : user.id,
        items: checkoutItems.map((item) => {
          const p = getProduct(item);
          return {
            productId: p.id,
            quantity: item.quantity || 1,
            price: p.price || 0,
          };
        }),
        payment: paymentMethod,
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

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3212";
      const res = await fetch(`${apiUrl}/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Đặt hàng thất bại");
      }

      localStorage.removeItem("checkout_items");

      if (!isGuest && user?.id) {
        for (const item of checkoutItems) {
          if (item.id) {
            try {
              await cartService.removeItem(item.id, user.id);
            } catch (_) {}
          }
        }
      }

      alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ bạn sớm.");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.message || "Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột trái: Sản phẩm */}
      <div className="md:col-span-2">
        <div className="bg-white shadow p-6 rounded mb-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          <ul className="divide-y">
            {checkoutItems.map((item) => {
              const p = getProduct(item);
              const itemKey = item.id || p.id;
              const tempPrice = (p.price || 0) * (item.quantity || 0);
              const imgSrc = p.image?.startsWith("http") ? p.image : `${import.meta.env.VITE_API_URL || "http://localhost:3212"}${p.image}`;
              return (
                <li key={itemKey} className="py-4 flex items-center gap-4">
                  <img
                    src={imgSrc || "/images/waste_to_worth_logo.png"}
                    alt={p.name || p.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{p.name || p.title}</p>
                    <p className="text-sm text-gray-500">
                      Giá: {(p.price || 0).toLocaleString("vi-VN")}₫
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(itemKey, (item.quantity || 1) - 1)
                        }
                        className="px-2 py-1 border rounded"
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(itemKey, (item.quantity || 1) + 1)
                        }
                        className="px-2 py-1 border rounded"
                        disabled={(p.stock ?? 0) > 0 && (item.quantity || 1) >= (p.stock ?? 0)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold min-w-[100px] text-right">
                    {tempPrice.toLocaleString("vi-VN")}₫
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Cột phải: Thông tin & Thanh toán */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-lg font-semibold mb-4">Thông tin người mua</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Họ và tên *"
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email *"
              className="border p-2 rounded w-full"
              required={!user}
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại *"
              className="border p-2 rounded w-full"
              required
            />
            <select
              value={form.province}
              onChange={handleProvinceChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Chọn tỉnh / thành phố</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={form.district}
              onChange={handleDistrictChange}
              className="border p-2 rounded w-full"
              disabled={!districts.length}
            >
              <option value="">Chọn quận / huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={form.ward}
              onChange={(e) =>
                setForm((f) => ({ ...f, ward: Number(e.target.value) }))
              }
              className="border p-2 rounded w-full"
              disabled={!wards.length}
            >
              <option value="">Chọn phường / xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ chi tiết"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <p className="flex justify-between text-lg font-bold mb-4">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}₫</span>
          </p>
          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={form.paymentMethod === "COD"}
                onChange={handleInputChange}
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            {user && (
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Wallet"
                  checked={form.paymentMethod === "Wallet"}
                  onChange={handleInputChange}
                />
                Thanh toán bằng ví
              </label>
            )}
            {!user && (
              <p className="text-sm text-gray-500 mt-1">
                Đăng nhập để sử dụng thanh toán bằng ví.
              </p>
            )}
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
