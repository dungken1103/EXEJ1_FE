import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCube,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineMap,
} from "react-icons/hi2";
import SEO from "../../components/SEO";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";
const creamDark = "#ebe5dc";

const AboutPage = () => {

  return (
    <div
      className="min-h-screen text-[#2d2d2d] antialiased"
      style={{ backgroundColor: cream }}
    >
      <SEO
        title="Về Waste To Worth | Hành Trình Tái Sinh Gỗ Offcut & Bản Đồ Độc Bản"
        description="Khám phá câu chuyện của Waste To Worth - nơi những mảnh gỗ offcut được tái sinh thành bản đồ gỗ 3D độc bản. Tôn vinh vẻ đẹp tự nhiên và bảo vệ môi trường."
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Hero - Lời Ngỏ */}
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: brandBrown }}>
            Câu chuyện <span className="font-brand">Waste To Worth</span>
          </h1>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left relative">
            {/* Decoration Quote */}
            <div className="absolute -top-4 -left-4 text-6xl text-[#2d5a27] opacity-20 font-serif">“</div>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed font-light">
              <p>
                <span className="font-bold text-[#2d5a27]">Chào bạn,</span> chúng tôi là Waste To Worth.
              </p>
              <p>
                Chúng tôi đang ấp ủ một dự án kết hợp giữa tình yêu thiên nhiên và niềm đam mê du lịch.
                Ý tưởng của chúng tôi bắt nguồn từ những mảnh gỗ <strong>offcut</strong> (gỗ thừa, gỗ bị loại) trong các xưởng gỗ quý.
              </p>
              <p>
                Thay vì bị bỏ đi, chúng được chọn lọc, xử lý thủ công để trở thành những tấm <strong>Sản phẩm đồ gỗ độc bản</strong> – nơi lưu giữ ký ức và những vùng đất bạn đã đi qua.
              </p>
              <p>
                Trước khi chính thức ra mắt, chúng tôi rất mong được lắng nghe ý kiến của bạn để tạo ra những sản phẩm không chỉ đẹp, mà còn thực sự có ý nghĩa.
              </p>
              <p className="font-bold text-right pt-2" style={{ color: brandBrown }}>
                Trân trọng!
              </p>
            </div>
          </div>
        </header>

        {/* Recycling vs Upcycling */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${brandBrown}18`, color: brandBrown }}>
              <HiOutlineCube className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: brandBrown }}>
              Recycling (Tái chế)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Phá vỡ vật liệu (nghiền, nấu chảy) về dạng nguyên liệu thô để sản xuất lại.
              Quá trình này thường tốn năng lượng và chất lượng vật liệu có thể giảm đi.
            </p>
            <p className="text-xs text-gray-500">Ví dụ: Chai nhựa → Hạt nhựa → Ghế nhựa</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 border-2" style={{ borderColor: `${brandGreen}40` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: brandGreen, color: 'white' }}>
              <HiOutlineSparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: brandGreen }}>
              Upcycling (Tái chế nâng cấp)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Dùng sự sáng tạo biến đồ cũ thành sản phẩm mới với <strong>công năng khác và giá trị cao hơn</strong> mà không phá hủy vật liệu gốc.
              Tiết kiệm năng lượng và tạo ra sản phẩm độc bản.
            </p>
            <p className="text-xs text-gray-500">Ví dụ: Gỗ offcut → Bản đồ 3D nghệ thuật</p>
          </div>
        </section>

        {/* Core Values / Why Us */}
        <section className="text-center mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-8" style={{ color: brandBrown }}>
            Tại sao chúng mình chọn hành trình này?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <h4 className="font-bold mb-2" style={{ color: brandGreen }}>Tận dụng thay vì khai thác</h4>
              <p className="text-sm text-gray-600">100% nguyên liệu từ gỗ offcut. Không lãng phí tài nguyên, không chặt thêm cây mới.</p>
            </div>
            <div className="p-4">
              <h4 className="font-bold mb-2" style={{ color: brandGreen }}>Sản phẩm độc bản</h4>
              <p className="text-sm text-gray-600">Vân gỗ tự nhiên khiến không có hai tấm bản đồ nào giống hệt nhau.</p>
            </div>
            <div className="p-4">
              <h4 className="font-bold mb-2" style={{ color: brandGreen }}>Công năng thực tế</h4>
              <p className="text-sm text-gray-600">Vừa trang trí không gian, vừa là công cụ trực quan để tìm hiểu về địa lý.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl p-8 lg:p-12" style={{ backgroundColor: creamDark }}>
          <HiOutlineMap className="w-12 h-12 mx-auto mb-4" style={{ color: brandGreen }} />
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: brandBrown }}>
            Khám phá sản phẩm của chúng tôi
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Bản đồ Việt Nam cơ bản, chi tiết 63 tỉnh thành, hay theo vùng miền —
            tất cả từ gỗ quý tái chế, cắt CNC chính xác.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition hover:opacity-95"
            style={{ backgroundColor: brandGreen }}
          >
            Xem cửa hàng
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </article>
    </div>
  );
};

export default AboutPage;
