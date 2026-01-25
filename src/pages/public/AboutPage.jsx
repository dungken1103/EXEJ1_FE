import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCube,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineMap,
} from "react-icons/hi2";

const brandGreen = "#2d5a27";
const brandBrown = "#5D4E37";
const cream = "#f8f5f0";
const creamDark = "#ebe5dc";

const AboutPage = () => {
  useEffect(() => {
    document.title = "Về chúng tôi | Waste To Worth";
    return () => { document.title = "Waste To Worth"; };
  }, []);

  return (
    <div
      className="min-h-screen text-[#2d2d2d] antialiased"
      style={{ backgroundColor: cream }}
    >
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Hero */}
        <header className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: brandBrown }}>
            Về <span className="font-brand">Waste To Worth</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Từ gỗ thừa ở xưởng mộc đến mô hình bản đồ Việt Nam trong tay bạn — 
            chúng tôi biến phế phẩm thành sản phẩm có giá trị, thân thiện môi trường và đầy ý nghĩa.
          </p>
        </header>

        {/* Đoạn giới thiệu chính - SEO */}
        <section className="mb-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: brandBrown }}>
              Câu chuyện của chúng tôi
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Waste To Worth</strong> ra đời từ ý tưởng tận dụng gỗ quý còn dùng được tại các xưởng mộc, 
              nội thất — thay vì bỏ đi, chúng tôi chuyển chúng thành <strong>mô hình bản đồ Việt Nam 3D</strong> 
              cắt CNC chính xác. Mỗi sản phẩm đều mang vân gỗ thật, dễ ghép tại nhà, phù hợp trang trí và quà tặng.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi tin rằng không có “gỗ bỏ đi” — chỉ có nguồn nguyên liệu chưa được tạo giá trị đúng cách. 
              Bản đồ Việt Nam bằng gỗ tái chế vừa mang lại vẻ đẹp cho không gian, vừa gửi đi thông điệp 
              bảo vệ môi trường và tự hào nguồn gốc <strong>Made in Vietnam</strong>.
            </p>
          </div>
        </section>

        {/* 3 cột: Sứ mệnh, Tầm nhìn, Giá trị */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14" aria-label="Sứ mệnh và giá trị">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 text-center hover:shadow-lg transition-shadow">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}
            >
              <HiOutlineHeart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: brandBrown }}>
              Sứ mệnh
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Biến gỗ tái chế thành sản phẩm ý nghĩa: mô hình bản đồ gỗ chất lượng, dễ tiếp cận, 
              giúp mọi người vừa trang trí không gian vừa góp phần giảm lãng phí tài nguyên.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 text-center hover:shadow-lg transition-shadow">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${brandBrown}18`, color: brandBrown }}
            >
              <HiOutlineSparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: brandBrown }}>
              Tầm nhìn
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trở thành thương hiệu mô hình bản đồ gỗ tái chế được tin chọn tại Việt Nam — 
              nơi giao thoa giữa thủ công, công nghệ CNC và ý thức môi trường.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 text-center hover:shadow-lg transition-shadow">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${brandGreen}18`, color: brandGreen }}
            >
              <HiOutlineCube className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-3" style={{ color: brandBrown }}>
              Giá trị cốt lõi
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Chất lượng từng mảnh ghép — Tận tâm với khách hàng — Minh bạch nguồn gốc gỗ — 
              Đồng hành từ chọn mẫu đến hướng dẫn lắp ráp tại nhà.
            </p>
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
