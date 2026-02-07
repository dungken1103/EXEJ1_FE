import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "../../services/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";
const creamDark = "#ebe5dc";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    try {
      const res = await axios.post("/auth/login", form);
      const user = res.data.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: cream }}
    >
      <div className="w-full max-w-md">
        {/* Logo & title */}
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

        <div
          className="rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ backgroundColor: "white" }}
        >
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-6" style={{ color: brandBrown }}>
              Đăng nhập
            </h1>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 px-3 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1.5 font-medium">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 ${errors.email
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-emerald-800/40"
                    }`}
                  placeholder="your@email.com"
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
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 pr-11 ${errors.password
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200"
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-95"
                style={{ backgroundColor: brandGreen }}
              >
                Đăng nhập
              </button>
            </form>

            <div className="flex items-center my-5">
              <hr className="flex-1 border-gray-200" />
              <span className="px-3 text-gray-400 text-sm">hoặc</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
            >
              <FcGoogle className="text-xl" />
              Đăng nhập bằng Google
            </button>

            <p className="mt-6 text-sm text-center text-gray-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: brandGreen }}>
                Đăng ký
              </Link>
            </p>
            <p className="mt-2 text-sm text-center text-gray-600">
              Quên mật khẩu?{" "}
              <Link to="/reset-password" className="font-semibold hover:underline" style={{ color: brandGreen }}>
                Đặt lại mật khẩu
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

export default Login;
