import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import SEO from "../../components/SEO";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
                onClick={onClick}
            >
                <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-[#2d5a27]' : 'text-gray-800 group-hover:text-[#2d5a27]'}`}>
                    {question}
                </span>
                <span className="ml-4 shrink-0 text-gray-400">
                    {isOpen ? <HiChevronUp /> : <HiChevronDown />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-gray-600 text-sm leading-relaxed pr-8">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const brandGreen = "#2d5a27";
    const brandBrown = "#5D4E37";
    const cream = "#f8f5f0";

    const faqs = [
        {
            question: "1. Bản đồ làm từ chất liệu gì?",
            answer: "Sản phẩm được làm từ gỗ tự nhiên tái sử dụng (offcut) từ các xưởng gỗ quý. Gỗ đã được xử lý kỹ lưỡng, gia công CNC và phủ bảo vệ để đảm bảo độ bền và tính thẩm mỹ."
        },
        {
            question: "2. Tại sao mỗi sản phẩm nhìn lại khác nhau về màu sắc/vân gỗ?",
            answer: "Vì đây là gỗ tự nhiên nên vân gỗ, mắt gỗ và sắc độ màu sẽ có sự khác biệt nhẹ ngẫu nhiên. Điều này đảm bảo mỗi chiếc bản đồ bạn nhận được là phiên bản độc bản, duy nhất trên thế giới."
        },
        {
            question: "3. Sản phẩm có treo tường được không?",
            answer: "Có. Chúng tôi thiết kế sản phẩm để dễ dàng treo tường. Đi kèm trong hộp sẽ có hướng dẫn lắp đặt và bộ phụ kiện treo chuyên dụng tùy theo phiên bản bạn mua."
        },
        {
            question: "4. Trong hộp sản phẩm bao gồm những gì?",
            answer: "Mỗi hộp sản phẩm bao gồm: Tấm bản đồ gỗ hoàn thiện, bộ phụ kiện lắp đặt/trưng bày đi kèm (tùy mẫu), và hướng dẫn sử dụng/bảo quản."
        },
        {
            question: "5. Shop có nhận khắc tên hay cá nhân hoá không?",
            answer: "Có. Chúng tôi nhận khắc tên, lời nhắn hoặc logo doanh nghiệp lên sản phẩm. Lưu ý: Thời gian xử lý đơn hàng cá nhân hóa sẽ lâu hơn so với hàng tiêu chuẩn (cần thêm 3-7 ngày)."
        },
        {
            question: "6. Bao lâu thì tôi nhận được hàng?",
            answer: "Đối với hàng có sẵn: 1–3 ngày xử lý + 1–5 ngày vận chuyển. Đối với hàng cá nhân hoá: 3–7 ngày xử lý + thời gian vận chuyển."
        },
        {
            question: "7. Nếu hàng bị bể vỡ do vận chuyển thì sao?",
            answer: "Bạn hãy yên tâm. Vui lòng báo ngay cho chúng tôi trong vòng 48 giờ kể từ khi nhận hàng, kèm theo ảnh và video mở hộp. Waste To Worth sẽ hỗ trợ đổi mới hoặc gửi sản phẩm thay thế ngay lập tức."
        },
        {
            question: "8. Đổi trả hàng như thế nào?",
            answer: "Chúng tôi hỗ trợ đổi/hoàn tiền nếu sản phẩm có lỗi sản xuất hoặc hư hỏng do vận chuyển. Lưu ý: Hàng đặt cá nhân hoá (khắc tên riêng) chỉ được hỗ trợ đổi/hoàn khi có lỗi kỹ thuật, không hỗ trợ đổi trả theo nhu cầu cá nhân."
        },
        {
            question: "9. Bảo quản bản đồ gỗ có khó không?",
            answer: "Rất đơn giản. Bạn chỉ cần tránh để sản phẩm bị ngấm nước hoặc ở nơi có độ ẩm quá cao/nắng gắt trực tiếp trong thời gian dài. Vệ sinh bằng cách lau nhẹ bằng khăn mềm khô hoặc hơi ẩm, tránh dùng hóa chất tẩy rửa mạnh."
        }
    ];

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: cream, color: "#2d2d2d" }}>
            <SEO
                title="Câu Hỏi Thường Gặp (FAQ) - Gỗ Offcut & Cá Nhân Hóa | Waste To Worth"
                description="Giải đáp thắc mắc về chất liệu gỗ offcut, hướng dẫn treo bản đồ, thời gian giao hàng và dịch vụ cá nhân hóa sản phẩm của Waste To Worth."
            />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: brandBrown }}>
                        Câu hỏi thường gặp
                    </h1>
                    <p className="text-gray-600">
                        Giải đáp những thắc mắc phổ biến về sản phẩm và dịch vụ của chúng tôi.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Bạn có câu hỏi khác?
                    </p>
                    <Link
                        to="/contact"
                        className="font-semibold underline hover:text-green-700 transition"
                        style={{ color: brandGreen }}
                    >
                        Liên hệ trực tiếp với chúng tôi
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
