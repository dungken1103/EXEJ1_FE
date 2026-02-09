import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineTruck, HiOutlineClock, HiOutlineShieldCheck, HiOutlineExclamationCircle } from "react-icons/hi2";
import SEO from "../../components/SEO";

const ShippingPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const brandGreen = "#2d5a27";
    const brandBrown = "#5D4E37";
    const cream = "#f8f5f0";

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: cream, color: "#2d2d2d" }}>
            <SEO
                title="Chính Sách Vận Chuyển & Giao Hàng (1-5 Ngày) | Waste To Worth"
                description="Thông tin chi tiết về thời gian giao hàng (1-5 ngày), phí vận chuyển và chính sách Freeship nội thành Hà Nội của Waste To Worth."
            />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-8 sm:p-12 text-center border-b border-gray-100">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: brandBrown }}>
                        Chính sách vận chuyển
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Thông tin chi tiết về thời gian, chi phí và quy trình giao hàng của Waste To Worth.
                    </p>
                </div>

                <div className="p-8 sm:p-12 space-y-12">
                    {/* 1. Delivery Time */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${brandGreen}15`, color: brandGreen }}>
                                <HiOutlineClock className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3" style={{ color: brandBrown }}>
                                    1. Thời gian giao hàng dự kiến
                                </h2>
                                <div className="space-y-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Nội thành Hà Nội:</span> 1–2 ngày
                                    </p>
                                    <p>
                                        <span className="font-semibold">Tỉnh/thành khác:</span> 2–5 ngày
                                    </p>
                                    <p className="text-sm text-gray-500 italic mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        *Thời gian có thể thay đổi do yếu tố thời tiết, dịp lễ Tết, hoặc điều kiện vận hành của đơn vị vận chuyển.
                                        Chúng tôi sẽ luôn nỗ lực để đơn hàng đến tay bạn sớm nhất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Shipping Fees */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${brandBrown}15`, color: brandBrown }}>
                                <HiOutlineTruck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3" style={{ color: brandBrown }}>
                                    2. Phí vận chuyển
                                </h2>
                                <div className="space-y-3 text-gray-700">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <strong>Phí ship:</strong> Sẽ được hiển thị và báo trước chi tiết tại bước xác nhận đơn hàng (Checkout).
                                        </li>
                                        <li>
                                            <strong>Ưu đãi:</strong> Áp dụng <span className="font-semibold text-green-700">FREESHIP</span> cho tất cả đơn hàng trong phạm vi nội thành Hà Nội.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Inspection */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: `${brandGreen}15`, color: brandGreen }}>
                                <HiOutlineShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3" style={{ color: brandBrown }}>
                                    3. Kiểm tra hàng khi nhận
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Để đảm bảo quyền lợi tốt nhất, Waste To Worth khuyến khích quý khách <strong>quay video clip quá trình mở hộp</strong> (unboxing).
                                    Đây sẽ là cơ sở quan trọng để chúng tôi hỗ trợ xử lý nhanh chóng trong trường hợp sản phẩm có lỗi phát sinh hoặc thiếu phụ kiện.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Failed Delivery */}
                    <section>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: "rgba(220, 38, 38, 0.1)", color: "#DC2626" }}>
                                <HiOutlineExclamationCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3" style={{ color: brandBrown }}>
                                    4. Giao hàng thất bại / Hoàn hàng
                                </h2>
                                <p className="text-gray-700 mb-2">
                                    Trong trường hợp đơn hàng không thể giao thành công do:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-3">
                                    <li>Khách hàng cung cấp sai thông tin địa chỉ hoặc số điện thoại.</li>
                                    <li>Khách hàng không nhận hàng hoặc không liên lạc được nhiều lần.</li>
                                </ul>
                                <p className="text-gray-700">
                                    Đơn hàng có thể sẽ bị hoàn về xưởng. Trong trường hợp này, Shop sẽ phải chịu chi phí vận chuyển chiều đi và về (với đơn vị vận chuyển).
                                    Rất mong quý khách lưu ý điện thoại để việc giao nhận diễn ra thuận lợi.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-600 mb-4">
                            Cần hỗ trợ thêm về vận chuyển?
                        </p>
                        <Link
                            to="/contact"
                            className="inline-block px-6 py-2.5 rounded-full font-medium text-white transition hover:opacity-90"
                            style={{ backgroundColor: brandGreen }}
                        >
                            Liên hệ chúng tôi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
