import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowPath, HiOutlineXCircle, HiOutlineChatBubbleLeftRight, HiOutlineCurrencyDollar } from "react-icons/hi2";
import SEO from "../../components/SEO";

const ReturnPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const brandGreen = "#2d5a27";
    const brandBrown = "#5D4E37";
    const cream = "#f8f5f0";

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: cream, color: "#2d2d2d" }}>
            <SEO
                title="Chính Sách Đổi Trả & Hoàn Tiền | Cam Kết Chất Lượng | Waste To Worth"
                description="Quyền lợi khách hàng tại Waste To Worth: Đổi mới 1-1 nếu lỗi sản xuất hoặc vận chuyển. Quy trình xử lý nhanh chóng trong 48h."
            />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-8 sm:p-12 text-center border-b border-gray-100">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: brandBrown }}>
                        Chính sách đổi trả & Hoàn tiền
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Cam kết chất lượng và quyền lợi khách hàng tại Waste To Worth.
                    </p>
                </div>

                <div className="p-8 sm:p-12 space-y-14">
                    {/* A. Conditions */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: brandBrown }}>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm" style={{ backgroundColor: brandBrown }}>A</span>
                            Điều kiện đổi trả
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-[#f8fcf8] p-6 rounded-xl border border-green-100">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: brandGreen }}>
                                    <HiOutlineArrowPath className="w-5 h-5" />
                                    1. Lỗi từ Shop (Nhà sản xuất)
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">Bạn được đổi mới hoặc hoàn tiền nếu sản phẩm gặp các vấn đề:</p>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                    <li>Cong vênh bất thường, tách lớp, nứt gãy do kỹ thuật gia công.</li>
                                    <li>Sai kích thước, sai mẫu mã so với mô tả và xác nhận đơn hàng.</li>
                                    <li>Lỗi hoàn thiện nghiêm trọng (sơn/phủ lỗi lớn, bong tróc bất thường khi mới nhận).</li>
                                </ul>
                            </div>

                            <div className="bg-[#fffbf5] p-6 rounded-xl border border-orange-100">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#d97706" }}>
                                    <HiOutlineXCircle className="w-5 h-5" />
                                    2. Hư hỏng do vận chuyển
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">Sản phẩm bị móp vỡ, trầy xước nặng, gãy hỏng trong quá trình giao hàng.</p>
                                <div className="text-sm border-t border-orange-200 pt-3 mt-3">
                                    <p><strong>Điều kiện:</strong> Cần có video quay lại quá trình mở hộp (unboxing) hoặc biên bản đồng kiểm.</p>
                                    <p className="mt-1"><strong>Thời hạn báo lỗi:</strong> Trong vòng <span className="font-bold text-red-600">48 giờ</span> kể từ lúc nhận hàng thành công.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* B. Exclusions */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: brandBrown }}>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm" style={{ backgroundColor: brandBrown }}>B</span>
                            Các trường hợp KHÔNG áp dụng
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-gray-700 space-y-4">
                            <p>
                                Vì sản phẩm là <strong>gỗ tự nhiên/offcut thủ công</strong>, một số đặc điểm sau đây được xem là “đặc tính vật liệu” và nét đẹp riêng của bản độc bản, <strong>không phải là lỗi</strong>:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li>Vân gỗ, mắt gỗ, sự chênh lệch nhẹ về màu sắc giữa các lô gỗ.</li>
                                <li>Vết nối, đường ghép tự nhiên của gỗ tái sử dụng (đã được xử lý thẩm mỹ).</li>
                                <li>Sai số kích thước rất nhỏ do chế tác thủ công (1–2mm).</li>
                            </ul>
                            <div className="pt-2">
                                <p className="font-semibold mb-1">Ngoài ra, không hỗ trợ đổi trả nếu:</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                    <li>Sản phẩm cá nhân hóa/làm theo yêu cầu (khắc tên, đổi màu riêng...) trừ khi có lỗi sản xuất.</li>
                                    <li>Hư hỏng do khách hàng sử dụng sai cách (để ngấm nước, rơi vỡ, để nơi ánh nắng gắt/ẩm mốc lâu ngày...).</li>
                                    <li>Không có bằng chứng video mở hộp khi khiếu nại về lỗi vận chuyển.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* C. Process */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: brandBrown }}>
                            <span className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm" style={{ backgroundColor: brandBrown }}>C</span>
                            Quy trình đổi trả & Hoàn tiền
                        </h2>

                        <div className="space-y-6">
                            {/* Steps */}
                            <div className="relative border-l-2 border-gray-200 ml-4 pl-8 space-y-8">
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 font-bold text-xs text-gray-500">1</span>
                                    <h4 className="font-bold text-lg" style={{ color: brandGreen }}>Bước 1: Liên hệ & Báo lỗi</h4>
                                    <p className="text-sm text-gray-600 mt-1">Nhắn tin qua Fanpage/Zalo hoặc Email kèm:</p>
                                    <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                                        <li>Mã đơn hàng, số điện thoại.</li>
                                        <li>Ảnh/Video chi tiết lỗi (ưu tiên video mở hộp).</li>
                                        <li>Mô tả vấn đề gặp phải.</li>
                                    </ul>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 font-bold text-xs text-gray-500">2</span>
                                    <h4 className="font-bold text-lg" style={{ color: brandGreen }}>Bước 2: Xác nhận (24-48h)</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Waste To Worth sẽ kiểm tra và phản hồi. Nếu đủ điều kiện, chúng tôi sẽ tiến hành đổi mới, gửi sản phẩm thay thế hoặc hoàn tiền tùy trường hợp.
                                    </p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 font-bold text-xs text-gray-500">3</span>
                                    <h4 className="font-bold text-lg" style={{ color: brandGreen }}>Bước 3: Gửi hàng đổi trả</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Chúng tôi sẽ tạo yêu cầu trên hệ thống vận chuyển (GHTK). Bưu tá sẽ đến lấy hàng hoàn từ bạn.
                                        Vui lòng đóng gói cẩn thận như lúc nhận để tránh hư hỏng thêm.
                                    </p>
                                </div>
                            </div>

                            {/* Refund Policy */}
                            <div className="bg-[#f0fdf4] border border-green-200 rounded-xl p-6 mt-6">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: brandGreen }}>
                                    <HiOutlineCurrencyDollar className="w-5 h-5" />
                                    Chính sách hoàn tiền
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li><strong>Khi nào hoàn tiền?</strong> Khi hết hàng đổi, khách không muốn đổi, hoặc đơn hàng đã thanh toán nhưng bị hủy hợp lệ.</li>
                                    <li><strong>Thời gian hoàn:</strong> 1–3 ngày làm việc (tùy ngân hàng).</li>
                                    <li><strong>Khoản hoàn:</strong> 100% giá trị sản phẩm. Phí ship sẽ được hoàn lại nếu lỗi thuộc về Xưởng sản xuất hoặc Đơn vị vận chuyển.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500 italic">
                        <p>
                            "Mỗi sản phẩm là một phiên bản độc nhất được làm từ gỗ tự nhiên và các mảnh gỗ quý tận dụng.
                            Vân gỗ, mắt gỗ và sắc độ có thể khác nhau nhẹ — đây là nét riêng tạo nên hồn của bản đồ Waste To Worth."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
