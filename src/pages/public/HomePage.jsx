import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineSparkles,
  HiOutlineMap,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineCheckBadge,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineArchiveBox,
  HiOutlineCog6Tooth,
  HiOutlineCheckCircle,
  HiOutlineStar,
} from 'react-icons/hi2';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import SafeImage from '../../components/SafeImage';

// Animate when element enters viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px', ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

const SectionReveal = ({ children, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
    >
      {children}
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3212';
const getImageUrl = (path) => {
  if (!path) return '/images/waste_to_worth_logo.png';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const green = {
    light: '#6b9b5a',
    DEFAULT: '#2d5a27',
    dark: '#1e3d1a',
  };
  const brown = {
    light: '#c4a574',
    DEFAULT: '#5D4E37',
    dark: '#3d3226',
  };
  const cream = '#f8f5f0';
  const creamDark = '#ebe5dc';

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getAll({ limit: 8, page: 1, status: 'AVAILABLE' }),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : []);
        const data = prodRes?.data;
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Homepage load:', err);
      }
    };
    load();
  }, []);

  const categoryBlocks = categories.length >= 3
    ? categories.slice(0, 4)
    : [
      { id: '', name: 'Bản đồ Việt Nam', slug: 'ban-do-viet-nam' },
      { id: '', name: 'Bản đồ theo vùng', slug: 'ban-do-theo-vung' },
      { id: '', name: 'Mô hình mini', slug: 'mo-hinh-mini' },
    ].slice(0, 4);

  return (
    <div
      className="min-h-screen text-[#2d2d2d] antialiased overflow-x-hidden"
      style={{ backgroundColor: cream }}
    >
      {/* ═══ HERO (Migo: Decoration ideas / ĐA DẠNG TRONG LỰA CHỌN) ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="/images/background.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" /> {/* Cinematic Overlay */}
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <p
            className="text-sm uppercase tracking-[0.25em] mb-4 animate-fade-in animation-fill-both"
            style={{ color: brown.light }}
          >
            Decoration ideas
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-4 animate-fade-in-up animation-fill-both animation-delay-100">
            ĐA DẠNG TRONG LỰA CHỌN
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed font-light animate-fade-in-up animation-fill-both animation-delay-200">
            Một không gian ấn tượng bắt đầu từ mô hình bản đồ gỗ — gỗ quý tái chế, CNC chính xác, Made in Vietnam.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in-up animation-fill-both animation-delay-300"
            style={{ backgroundColor: green.DEFAULT }}
          >
            Go To Shop
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none animate-fade-in animation-fill-both animation-delay-500">
          <SafeImage
            src="/images/waste_to_worth_logo.png"
            alt="Waste To Worth"
            className="w-28 sm:w-36 opacity-90 drop-shadow-2xl translate-y-1/2"
          />
        </div>
      </section>
      <div className="h-16 sm:h-20" />

      {/* ═══ CATEGORY BLOCKS (Migo: Bản Đồ VN, Thế Giới, Các Nước, Decor) ═══ */}
      <SectionReveal>
        <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {categoryBlocks.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  to={cat.id ? `/shop?categoryId=${cat.id}` : '/shop'}
                  className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: creamDark }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <HiOutlineMap className="w-12 h-12 mb-3 opacity-80" style={{ color: brown.DEFAULT }} />
                    <h3 className="text-lg font-bold" style={{ color: brown.DEFAULT }}>
                      {cat.name}
                    </h3>
                    <span className="mt-2 text-sm font-medium flex items-center gap-1" style={{ color: green.DEFAULT }}>
                      Shop now
                      <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ TAGLINE (Migo-style quote) ═══ */}
      <SectionReveal>
        <section className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl sm:text-2xl font-medium text-gray-700 leading-relaxed">
              “Từ gỗ bỏ đi ở xưởng mộc đến <span className="font-semibold" style={{ color: green.DEFAULT }}>mô hình bản đồ Việt Nam</span> trong tay bạn — không lãng phí, chỉ thêm giá trị.”
            </p>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ VALUE PROPS (Migo: Handmade, Đa dạng, Khác biệt) ═══ */}
      <SectionReveal>
        <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: HiOutlineCube, title: 'Handmade', desc: 'Sản phẩm được làm thủ công chi tiết tỉ mỉ từ gỗ quý tái chế, từng miếng ghép đều có vân gỗ độc đáo.', color: brown.DEFAULT },
                { icon: HiOutlineSparkles, title: 'Đa dạng', desc: 'Mẫu mã đa dạng — bản đồ cơ bản, 63 tỉnh thành, theo vùng — đáp ứng nhu cầu trang trí và quà tặng.', color: green.DEFAULT },
                { icon: HiOutlineMap, title: 'Khác biệt', desc: 'Khác biệt từ gỗ tái chế & CNC: sản phẩm làm nên không gian đặc biệt, thân thiện môi trường.', color: green.light },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: brown.DEFAULT }}>{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ CÁCH CHÚNG TÔI TẠO RA SẢN PHẨM ═══ */}
      <SectionReveal>
        <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-20" style={{ backgroundColor: creamDark }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: brown.DEFAULT }}>
              CÁCH CHÚNG TÔI TẠO RA SẢN PHẨM
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Từ gỗ thừa tại xưởng mộc đến mô hình bản đồ trong tay bạn — quy trình minh bạch, từng bước tỉ mỉ.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: HiOutlineArchiveBox,
                  step: '1',
                  title: 'Thu gom gỗ tái chế',
                  desc: 'Chúng tôi thu nhận gỗ quý còn dùng được từ xưởng mộc, nội thất — gỗ Hương, Gụ, Sồi... được phân loại kỹ theo loại và kích thước phù hợp cho CNC.',
                },
                {
                  icon: HiOutlineCog6Tooth,
                  step: '2',
                  title: 'Thiết kế & cắt CNC',
                  desc: 'Bản đồ Việt Nam được số hóa chuẩn, từng mảnh được cắt bằng máy CNC từ tấm gỗ thật. Đường cắt chính xác giúp các mảnh khớp nhau khi ghép.',
                },
                {
                  icon: HiOutlineCheckCircle,
                  step: '3',
                  title: 'Kiểm tra chất lượng',
                  desc: 'Từng mảnh được kiểm tra vân gỗ, độ sắc nét và không mảnh vỡ. Chỉ những bộ đạt chuẩn mới được đóng gói và gửi đến khách hàng.',
                },
                {
                  icon: HiOutlineCube,
                  step: '4',
                  title: 'Đóng gói & giao hàng',
                  desc: 'Sản phẩm được đóng gói cẩn thận kèm hướng dẫn ghép. Giao tận nơi — bạn chỉ cần bỏ ra vài giờ để tự tay ghép bản đồ Việt Nam 3D tại nhà.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <span className="absolute top-4 right-4 text-4xl font-black opacity-10" style={{ color: brown.DEFAULT }}>
                    {item.step}
                  </span>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${green.DEFAULT}18`, color: green.DEFAULT }}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: brown.DEFAULT }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ BỘ SƯU TẬP / SẢN PHẨM NỔI BẬT (Migo: SẢN PHẨM MỚI) ═══ */}
      {featuredProducts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-20" style={{ backgroundColor: creamDark }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: brown.DEFAULT }}>
              SẢN PHẨM NỔI BẬT
            </h2>
            <p className="text-center text-gray-600 mb-10">Mô hình bản đồ gỗ 3D từ gỗ quý tái chế</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.slice(0, 8).map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-100">
                    <SafeImage
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 truncate text-sm" style={{ color: brown.DEFAULT }}>
                      {p.name}
                    </h3>
                    <p className="text-sm font-bold mt-1" style={{ color: green.DEFAULT }}>
                      {(p.price || 0).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-95"
                style={{ backgroundColor: green.DEFAULT }}
              >
                Xem tất cả sản phẩm
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ BẮT ĐẦU VỚI Ý TƯỞNG MỚI (Migo: 3 bước) ═══ */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: brown.DEFAULT }}>
            CÁCH BẮT ĐẦU MỘT Ý TƯỞNG MỚI
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Bạn đang muốn trang trí không gian bằng bản đồ gỗ? Hãy bắt đầu từ đây.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              { step: '01', title: 'Chọn sở thích', desc: 'Chọn mẫu bản đồ bạn thích — cơ bản, chi tiết 63 tỉnh thành, hoặc theo vùng miền.' },
              { step: '02', title: 'Chọn không gian', desc: 'Xác định vị trí treo hoặc đặt — phòng khách, phòng làm việc, quà tặng.' },
              { step: '03', title: 'Chọn sản phẩm', desc: 'Vào cửa hàng, chọn sản phẩm phù hợp và nhận hàng — tự ghép tại nhà theo hướng dẫn.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="inline-block text-3xl sm:text-4xl font-black mb-2 opacity-30" style={{ color: brown.DEFAULT }}>
                  {item.step}
                </span>
                <h3 className="font-bold text-lg mb-2" style={{ color: brown.DEFAULT }}>{item.title}</h3>
                <p className="text-gray-600 text-sm leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-semibold"
              style={{ color: green.DEFAULT }}
            >
              Đến cửa hàng
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS - Đánh giá khách hàng ═══ */}
      <SectionReveal>
        <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-20" style={{ backgroundColor: cream }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: brown.DEFAULT }}>
              KHÁCH HÀNG NÓI VỀ CHÚNG TÔI
            </h2>
            <p className="text-center text-gray-600 mb-10">Trải nghiệm thực tế từ người đã sở hữu bản đồ gỗ <span className="font-brand">Waste To Worth</span></p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  name: 'Chị Minh Anh',
                  role: 'Nội trợ, TP.HCM',
                  content: 'Mình mua bản đồ 63 tỉnh thành treo phòng khách. Gỗ đẹp, vân rõ, ghép xong ai cũng khen. Đóng gói cẩn thận, có kèm hướng dẫn rất dễ làm.',
                  rating: 5,
                },
                {
                  name: 'Anh Đức Long',
                  role: 'Văn phòng, Hà Nội',
                  content: 'Mua làm quà tặng đối tác. Sản phẩm handmade từ gỗ tái chế nên ý nghĩa, khác hẳn quà công nghiệp. Bên giao đúng hẹn, tư vấn nhiệt tình.',
                  rating: 5,
                },
                {
                  name: 'Chị Hương Giang',
                  role: 'Giáo viên, Đà Nẵng',
                  content: 'Dùng cho tiết học Địa lý — học sinh rất thích. Từng mảnh gỗ nhỏ ghép thành bản đồ VN, vừa trang trí vừa học. Chất lượng tốt, giá hợp lý.',
                  rating: 5,
                },
              ].map((review) => (
                <div
                  key={review.name + review.role}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="flex gap-1 mb-4" aria-label={`${review.rating} sao`}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <HiOutlineStar key={`star-${review.name}-${i}`} className="w-5 h-5 flex-shrink-0" style={{ color: '#eab308' }} fill="#eab308" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1 mb-5">"{review.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-800" style={{ color: brown.DEFAULT }}>{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* ═══ TRUST BADGES (Migo footer: Giao hàng, Bảo hành, Hỗ trợ 24/7) ═══ */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-200" style={{ backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: HiOutlineTruck, title: 'GIAO HÀNG TẬN NƠI', desc: 'Nhận hàng và thanh toán tại nhà' },
              { icon: HiOutlineShieldCheck, title: 'BẢO HÀNH', desc: 'Đổi trả trong thời gian quy định' },
              { icon: HiOutlineChatBubbleBottomCenterText, title: 'HỖ TRỢ TƯ VẤN', desc: 'Tư vấn chọn mẫu & hướng dẫn lắp ghép' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${green.DEFAULT}18`, color: green.DEFAULT }}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: brown.DEFAULT }}>{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BLOCK ═══ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden"
        style={{ backgroundColor: brown.DEFAULT }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <HiOutlineCheckBadge className="w-12 h-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sẵn sàng mang bản đồ Việt Nam về nhà?
          </h2>
          <p className="text-white/85 mb-8">Chọn mô hình phù hợp — từ cơ bản đến chi tiết 63 tỉnh thành.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 transition-all duration-300"
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* ═══ ABOUT SNIPPET ═══ */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <SafeImage src="/images/waste_to_worth_logo.png" alt="Waste To Worth" className="w-40 h-auto opacity-95 flex-shrink-0" />
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-4 font-brand" style={{ color: brown.DEFAULT }}>Waste To Worth</h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-xl">
              Dự án biến phần gỗ quý bỏ đi thành mô hình 3D bản đồ Việt Nam. Cắt CNC từ gỗ thật, dễ ghép, bền đẹp và thân thiện môi trường.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-semibold" style={{ color: green.DEFAULT }}>
              Đọc thêm về chúng tôi
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
