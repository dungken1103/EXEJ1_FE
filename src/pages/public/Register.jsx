import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Họ tên không được để trống.";
    if (!form.email) {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không đúng định dạng.";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không trùng khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await Swal.fire({
        title: "Đăng ký thành công!",
        text: "Bạn đã có thể đăng nhập.",
        icon: "success",
        confirmButtonText: "Đồng ý",
        confirmButtonColor: brandGreen,
      });
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: "Email này đã được sử dụng." });
      } else if (err.response?.status === 400) {
        Swal.fire({
          title: "Thông tin không hợp lệ",
          text: "Vui lòng kiểm tra lại thông tin.",
          icon: "warning",
          confirmButtonColor: brandGreen,
        });
      } else {
        Swal.fire({
          title: "Lỗi hệ thống",
          text: "Vui lòng thử lại sau.",
          icon: "error",
          confirmButtonColor: brandGreen,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: cream }}
    >
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center mb-8">
          <img
            src="/images/waste_to_worth_logo.png"
            alt="Waste To Worth"
            className="w-20 h-20 object-contain"
          />
          <span className="mt-3 text-2xl font-brand" style={{ color: brandBrown }}>
            Waste To Worth
          </span>
          <span className="text-sm text-gray-500 mt-0.5">
            Bản đồ Việt Nam 3D từ gỗ quý tái chế
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-6" style={{ color: brandBrown }}>
              Đăng ký tài khoản
            </h1>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1.5 font-medium">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-200"
                  }`}
                  placeholder="Nguyễn Văn A"
                  id="name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1.5 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    errors.email ? "border-red-400 focus:ring-red-300" : "border-gray-200"
                  }`}
                  placeholder="you@example.com"
                  id="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-gray-700 mb-1.5 font-medium">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 pr-11 ${
                    errors.password ? "border-red-400 focus:ring-red-300" : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                  id="password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="cf-password" className="block text-gray-700 mb-1.5 font-medium">
                  Xác nhận mật khẩu
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 pr-11 ${
                    errors.confirmPassword ? "border-red-400 focus:ring-red-300" : "border-gray-200"
                  }`}
                  placeholder="••••••••"
                  id="cf-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600 p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-95 disabled:opacity-70"
                style={{ backgroundColor: brandGreen }}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: brandGreen }}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Quay về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
