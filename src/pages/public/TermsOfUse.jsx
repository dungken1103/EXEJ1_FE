
import React from 'react';

const TermsOfUse = () => {
    const brandBrown = '#5D4E37';
    const textGray = '#4B5563';

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: brandBrown }}>Điều Khoản Sử Dụng</h1>

            <div className="space-y-6 text-justify" style={{ color: textGray }}>
                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>1. Giới thiệu</h2>
                    <p>
                        Chào mừng bạn đến với website Waste To Worth. Khi bạn truy cập và sử dụng website này, bạn đồng ý tuân thủ và bị ràng buộc bởi các quy định và điều khoản sử dụng dưới đây.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>2. Tài khoản người dùng</h2>
                    <p>
                        Để sử dụng một số tính năng của website, bạn có thể cần tạo tài khoản. Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.
                        Bạn đồng ý thông báo ngay cho chúng tôi nếu phát hiện bất kỳ việc sử dụng trái phép tài khoản nào của bạn.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>3. Quyền sở hữu trí tuệ</h2>
                    <p>
                        Tất cả nội dung trên website này, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, thiết kế, là tài sản của Waste To Worth và được bảo vệ bởi luật sở hữu trí tuệ.
                        Nghiêm cấm mọi hành vi sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản của chúng tôi.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>4. Mua hàng và Thanh toán</h2>
                    <p>
                        Khi đặt hàng, bạn cam kết cung cấp thông tin chính xác và đầy đủ. Chúng tôi có quyền từ chối hoặc hủy đơn hàng nếu phát hiện thông tin không chính xác hoặc có dấu hiệu gian lận.
                        Giá cả và tình trạng sản phẩm có thể thay đổi mà không báo trước.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>5. Hành vi bị cấm</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Sử dụng website cho mục đích bất hợp pháp.</li>
                        <li>Can thiệp vào hoạt động của website hoặc máy chủ.</li>
                        <li>Vi phạm quyền riêng tư hoặc quấy rối người dùng khác.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>6. Thay đổi điều khoản</h2>
                    <p>
                        Chúng tôi có quyền thay đổi, chỉnh sửa các điều khoản này bất cứ lúc nào. Việc bạn tiếp tục sử dụng website sau khi có sự thay đổi đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>7. Liên hệ</h2>
                    <p>
                        Mọi thắc mắc về Điều khoản sử dụng, xin vui lòng liên hệ: <span className="font-medium">wtwwastetoworth@gmail.com</span>.
                    </p>
                </section>

                <p className="text-sm italic mt-8 pt-4 border-t border-gray-200">
                    Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                </p>
            </div>
        </div>
    );
};

export default TermsOfUse;
