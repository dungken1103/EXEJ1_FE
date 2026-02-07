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
            Trao một vòng đời mới cho những mảnh gỗ offcut. Thay vì bị bỏ đi, chúng được chọn lọc,
            xử lý và chế tác thủ công để tiếp tục hiện diện dưới một hình hài mới, mang giá trị lâu dài và bền vững.
          </p>
        </header>

        {/* Story Section - WTW FACT */}
        <section className="mb-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: brandBrown }}>
              Sự thật về những mảnh gỗ "thừa"
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Tại các xưởng gia công nội thất lớn, một cây gỗ quý lâu năm khi khai thác có thể nặng từ 3 đến 5 tấn.
                Tuy nhiên, để xẻ ra những tấm ván phẳng phiu, khoảng <strong>20-30%</strong> khối lượng cây gỗ đó sẽ bị loại bỏ dưới dạng "offcut" (đầu mẩu, bìa gỗ, gỗ vụn).
              </p>
              <p className="bg-[#f8f5f0] p-4 rounded-lg border-l-4" style={{ borderColor: brandGreen }}>
                <strong>Bạn có biết?</strong> 30% của một cây gỗ lớn tương đương khoảng <strong>1 TẤN</strong>.
                Mỗi lần một bộ sofa gỗ ra đời, một lượng gỗ quý có trọng lượng ngang ngửa một chiếc ô tô Sedan 4 chỗ lại bị đẩy vào lò đốt hoặc bãi phế liệu.
              </p>
              <p>
                Tại <strong>Waste to Worth (WTW)</strong>, chúng mình không cam tâm nhìn "chiếc ô tô" đó bị lãng phí.
                Hành trình của chúng mình bắt đầu từ việc đi nhặt nhạnh từng mảnh "offcut" quý giá đó để tái sinh thành những tấm bản đồ decor bền vững.
              </p>
            </div>
          </div>
        </section>

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
