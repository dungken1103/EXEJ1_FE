import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axiosConfig";
import { FiEye, FiEyeOff } from "react-icons/fi";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post("/auth/request-reset-password", { email });
      setMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (và thư mục spam).");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Gửi mã OTP thất bại. Kiểm tra lại email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post("/auth/verify-reset-otp", { email, otp });
      setMessage("Xác thực thành công. Nhập mật khẩu mới bên dưới.");
      setStep("newPassword");
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn (5 phút).");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu mới tối thiểu 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/auth/reset-password", { email, password });
      setMessage("Đặt lại mật khẩu thành công. Đang chuyển đến trang đăng nhập...");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại.");
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
            Quên mật khẩu
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-6" style={{ color: brandBrown }}>
              {step === "email" && "Nhập email đăng ký"}
              {step === "otp" && "Nhập mã OTP"}
              {step === "newPassword" && "Mật khẩu mới"}
            </h1>

            {message && (
              <p className="text-green-600 text-sm text-center mb-4 bg-green-50 py-2 px-3 rounded-xl">
                {message}
              </p>
            )}
            {error && (
              <p className="text-red-600 text-sm text-center mb-4 bg-red-50 py-2 px-3 rounded-xl">
                {error}
              </p>
            )}

            <form
              onSubmit={
                step === "email"
                  ? handleSendOtp
                  : step === "otp"
                    ? handleVerifyOtp
                    : handleResetPassword
              }
              className="space-y-5"
            >
              {step === "email" && (
                <div>
                  <label htmlFor="reset-email" className="block text-gray-700 mb-1.5 font-medium">
                    Email (tên đăng nhập)
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent"
                  />
                </div>
              )}

              {step === "otp" && (
                <div>
                  <label htmlFor="reset-otp" className="block text-gray-700 mb-1.5 font-medium">
                    Mã OTP (6 số)
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27] text-center text-lg tracking-[0.5em]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mã có hiệu lực trong 5 phút. Chưa nhận được? Kiểm tra hộp thư rác hoặc thử gửi lại.
                  </p>
                </div>
              )}

              {step === "newPassword" && (
                <>
                  <div className="relative">
                    <label htmlFor="new-password" className="block text-gray-700 mb-1.5 font-medium">
                      Mật khẩu mới
                    </label>
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27] pr-11"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label htmlFor="confirm-password" className="block text-gray-700 mb-1.5 font-medium">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a27] pr-11"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-95 disabled:opacity-70"
                style={{ backgroundColor: brandGreen }}
              >
                {loading
                  ? "Đang xử lý..."
                  : step === "email"
                    ? "Gửi mã OTP"
                    : step === "otp"
                      ? "Xác nhận OTP"
                      : "Đổi mật khẩu"}
              </button>
            </form>

            {step !== "email" && (
              <button
                type="button"
                onClick={() => {
                  setStep(step === "otp" ? "email" : "otp");
                  setError("");
                  setMessage("");
                }}
                className="w-full mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                ← Quay lại bước trước
              </button>
            )}

            <p className="mt-6 text-sm text-center text-gray-600">
              Nhớ mật khẩu?{" "}
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

export default ResetPassword;
