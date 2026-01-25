import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleLoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const token = params.get('token');

    if (!email || !token) {
      console.error('Thiếu email hoặc token trong URL');
      navigate('/login');
      return;
    }

    // Gọi API lấy thông tin user theo email
    fetch(`http://localhost:3212/users/email/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể lấy thông tin user');
        return res.json();
      })
      .then(data => {
        console.log('User info:', data);

        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', token);

        navigate('/');
      })
      .catch(err => {
        console.error('Lỗi khi lấy thông tin user:', err);
        navigate('/login');
      });
  }, [navigate, location.search]);

  return <div>Đang đăng nhập bằng Google...</div>;
}

export default GoogleLoginSuccess;
