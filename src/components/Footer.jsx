import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  const darkBrown = '#3d2914';
  const cream = '#f5f0e6';
  const creamText = '#e8dcc8';

  return (
    <div>
      <footer
        className="text-white px-10 py-10"
        style={{ backgroundColor: darkBrown }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          {/* Customer Service */}
          <div>
            <h5 className="font-semibold text-lg mb-4" style={{ color: cream }}>
              HỖ TRỢ KHÁCH HÀNG
            </h5>
            <ul className="space-y-2" style={{ color: creamText }}>
              <li><a href="#" className="hover:text-white transition">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition">Vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition">Đổi trả</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h5 className="font-semibold text-lg mb-4" style={{ color: cream }}>
              VỀ CHÚNG TÔI
            </h5>
            <ul className="space-y-2" style={{ color: creamText }}>
              <li><a href="/about" className="hover:text-white transition">Câu chuyện <span className="font-brand">Waste To Worth</span></a></li>
              <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
              <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold text-lg mb-4" style={{ color: cream }}>
              LIÊN HỆ
            </h5>
            <ul className="space-y-2" style={{ color: creamText }}>
              <li className="flex items-start"><MdLocationOn className="mr-2 mt-0.5 flex-shrink-0" /> Việt Nam</li>
              <li className="flex items-center"><MdPhone className="mr-2 flex-shrink-0" /> +84 xxx xxx xxx</li>
              <li className="flex items-center"><MdEmail className="mr-2 flex-shrink-0" /> contact@wastetoworth.vn</li>
            </ul>
          </div>

          {/* Brand + Social */}
          <div>
            <h5 className="font-semibold text-lg mb-4" style={{ color: cream }}>
              THEO DÕI
            </h5>
            <div className="flex space-x-4 text-xl mb-4" style={{ color: creamText }}>
              <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-white transition"><FaInstagram /></a>
              <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: cream }}>
              Waste To Worth
            </p>
            <p style={{ color: creamText }} className="text-sm">
              Mô hình 3D bản đồ Việt Nam từ gỗ quý tái chế — CNC chính xác, dễ ghép.
            </p>
          </div>
        </div>

        <hr className="my-6 border-opacity-30" style={{ borderColor: creamText }} />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm" style={{ color: creamText }}>
          <p>© {new Date().getFullYear()} <span className="font-brand">Waste To Worth</span>. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0 text-2xl opacity-80">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
