import React from 'react';

const PrivacyPolicy = () => {
    const brandBrown = '#5D4E37';
    const textGray = '#4B5563';

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: brandBrown }}>Chính Sách Bảo Mật</h1>

            <div className="space-y-6 text-justify" style={{ color: textGray }}>
                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>1. Thu thập thông tin</h2>
                    <p>
                        Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đăng nhập bằng Google, hoặc thực hiện mua hàng.
                        Thông tin bao gồm tên, địa chỉ email, số điện thoại và địa chỉ giao hàng.
                        Khi bạn đăng nhập bằng Google, chúng tôi chỉ yêu cầu quyền truy cập vào các thông tin cơ bản bao gồm: tên, địa chỉ email và ảnh đại diện công khai (scope: openid, email, profile). Chúng tôi không truy cập vào mật khẩu Google, danh bạ, Google Drive hoặc bất kỳ dữ liệu nào khác trong tài khoản Google của bạn.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>2. Sử dụng thông tin</h2>
                    <p>
                        Thông tin của bạn được sử dụng để:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Xử lý đơn hàng và giao hàng.</li>
                        <li>Cung cấp dịch vụ chăm sóc khách hàng.</li>
                        <li>Gửi thông báo về trạng thái đơn hàng hoặc các cập nhật quan trọng.</li>
                        <li>Cải thiện trải nghiệm mua sắm trên website Waste To Worth.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>3. Lưu trữ dữ liệu</h2>
                    <p>
                        Thông tin cá nhân của bạn được lưu trữ trên hệ thống máy chủ bảo mật và chỉ được giữ trong thời gian cần thiết để cung cấp dịch vụ hoặc theo yêu cầu pháp luật. Khi tài khoản bị xóa, dữ liệu liên quan sẽ được xóa hoặc ẩn danh trong thời gian hợp lý.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>4. Cookie</h2>
                    <p>
                        Website sử dụng cookie để duy trì phiên đăng nhập và cải thiện trải nghiệm người dùng. Bạn có thể tắt cookie trong trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đúng.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>5. Bảo mật thông tin</h2>
                    <p>
                        Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Chúng tôi sử dụng các biện pháp an ninh thích hợp để bảo vệ thông tin khỏi việc truy cập trái phép, tiết lộ, sửa đổi hoặc phá hủy.
                        Mật khẩu của bạn được mã hóa và không ai, kể cả nhân viên của chúng tôi, có thể xem được.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>6. Chia sẻ thông tin</h2>
                    <p>
                        Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ các đơn vị vận chuyển để thực hiện giao hàng (tên, địa chỉ, số điện thoại).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>7. Quyền của bạn</h2>
                    <p>
                        Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi hoặc thông qua trang cài đặt tài khoản.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3" style={{ color: brandBrown }}>8. Liên hệ</h2>
                    <p>
                        Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: <span className="font-medium">wtwwastetoworth@gmail.com</span>.
                    </p>
                </section>

                <p className="text-sm italic mt-8 pt-4 border-t border-gray-200">
                    Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
