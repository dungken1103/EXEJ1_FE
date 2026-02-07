import React, { useState, useEffect } from "react";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { HiOutlineChatBubbleBottomCenterText, HiOutlinePhone } from "react-icons/hi2";
import toast from "../../utils/toast";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";
const HOTLINE = "0395133868";
const ZALO_LINK = `https://zalo.me/${HOTLINE}`;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  useEffect(() => {
    document.title = "Liên hệ | Waste To Worth";
    return () => { document.title = "Waste To Worth"; };
  }, []);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Form hiện chưa gửi API — có thể tích hợp sau
    await new Promise((r) => setTimeout(r, 500));
    setSending(false);
    setForm({ name: "", email: "", message: "" });
    toast.success("Đã gửi tin nhắn", "Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.");
  };

  return (
    <div
      className="min-h-screen text-[#2d2d2d] antialiased"
      style={{ backgroundColor: cream }}
    >
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <header className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: brandBrown }}>
            Liên hệ <span className="font-brand">Waste To Worth</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cần tư vấn mẫu bản đồ gỗ, đặt hàng hoặc hỗ trợ lắp ghép? Hãy gửi tin nhắn hoặc gọi/Zalo trực tiếp để được phản hồi nhanh.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Thông tin liên hệ */}
          <section>
            <h2 className="text-xl font-bold mb-6" style={{ color: brandBrown }}>
              Thông tin liên hệ
            </h2>
            <ul className="space-y-5 text-gray-700">
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}>
                  <HiOutlinePhone className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800">Hotline</p>
                  <a href={`tel:${HOTLINE}`} className="text-lg font-medium hover:underline" style={{ color: brandGreen }}>
                    {HOTLINE}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Gọi trực tiếp để tư vấn & đặt hàng</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}>
                  <HiOutlineChatBubbleBottomCenterText className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800">Zalo</p>
                  <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: brandGreen }}>
                    Nhắn Zalo: {HOTLINE}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Hỗ trợ nhanh, gửi ảnh mẫu & báo giá</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}>
                  <MdEmail className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <a href="mailto:wtwwastetoworth@gmail.com" className="font-medium hover:underline" style={{ color: brandGreen }}>
                    wtwwastetoworth@gmail.com
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Phản hồi trong 24 giờ làm việc</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}>
                  <MdLocationOn className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800">Địa chỉ</p>
                  <p className="text-gray-600">Việt Nam — Nhận đặt hàng toàn quốc, giao hàng tận nơi.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-xl font-bold mb-6" style={{ color: brandBrown }}>
              Gửi tin nhắn
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#2d5a27] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#2d5a27] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Bạn cần tư vấn mẫu nào, số lượng, hoặc câu hỏi về sản phẩm..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[#2d5a27] focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
                style={{ backgroundColor: brandGreen }}
              >
                {sending ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
              Chúng tôi phản hồi trong vòng 24 giờ làm việc. Ưu tiên liên hệ hotline hoặc Zalo để được hỗ trợ nhanh nhất.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
};

export default ContactPage;
