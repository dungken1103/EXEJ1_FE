import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../services/axiosConfig";
import {
  FaUser,
  FaBookOpen,
  FaClipboardList,
  FaGift,
  FaQuestionCircle,
  FaHistory,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaTimes
} from 'react-icons/fa';
import categoryServices from '../services/categoryServices';
import Cookies from 'js-cookie';

export default function Sidebar({ onClose }) {
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setUser(userObj);
        setIsLogin(true);
      } catch {
        setUser(null);
        setIsLogin(false);
      }
    } else {
      setUser(null);
      setIsLogin(false);
    }
    getAllCategories();
  }, [isLogin]);

  const hanldeViewUserDetail = () => {
    if (isLogin) navigate(`/userdetail`);
    else navigate(`/login`);
  };

  const getAllCategories = async () => {
    const res = await categoryServices.getCategories();
    setCategories(res);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      navigate(`/`);
      setIsLogin(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 👉 Hàm click category để reload ShopPage
  const handleCategoryClick = (categoryId) => {
    if (onClose) onClose();
    navigate(`/shop?categoryId=${categoryId}`);
    window.location.reload(); // reload lại trang
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-violet-600 font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Chưa đăng nhập'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isProfileExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <button
          onClick={hanldeViewUserDetail}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold shadow transition"
        >
          <span>Xem thông tin cá nhân</span>
        </button>
        {isProfileExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Sách đã mua:</span>
                <span>24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Đơn hàng:</span>
                <span>12</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Danh mục sách</h3>
          <div className={`space-y-2 ${categories.length > 7 ? 'max-h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800' : ''}`}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
