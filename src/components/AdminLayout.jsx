import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFolder,
  FaCalendar,
  FaFileAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes, // Import FaTimes
} from "react-icons/fa";

const AdminLayout = () => {
  // Desktop: true = expanded, false = collapsed
  // Mobile: true = open (overlay), false = closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeItem, setActiveItem] = useState("dashboard");
  const location = useLocation();

  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        // Reset to expanded on desktop if moving from mobile
        setIsSidebarOpen(true);
      } else {
        // Close on mobile by default
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update active item based on path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("products")) setActiveItem("products");
    else if (path.includes("categories")) setActiveItem("category");
    else if (path.includes("orders")) setActiveItem("order");
    else if (path.includes("wood-types")) setActiveItem("wood-type");
    else setActiveItem("dashboard");
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: FaHome,
      path: "/admin-dashboard",
    },
    {
      id: "products",
      name: "Sản phẩm",
      icon: FaFolder,
      path: "/admin-dashboard/products",
    },
    {
      id: "wood-type",
      name: "Loại gỗ",
      icon: FaFolder,
      path: "/admin-dashboard/wood-types",
    },
    {
      id: "category",
      name: "Danh mục",
      icon: FaCalendar,
      path: "/admin-dashboard/categories",
    },
    {
      id: "order",
      name: "Đơn hàng",
      icon: FaFileAlt,
      path: "/admin-dashboard/orders",
    },
  ];

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Sidebar classes logic
  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`
    : `relative bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "w-64" : "w-16"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              {(!isMobile && isSidebarOpen) || isMobile ? (
                <span className="ml-3 text-xl font-bold whitespace-nowrap">Admin</span>
              ) : null}
            </div>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <FaTimes />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-6 overflow-y-auto">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors group ${isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    title={!isSidebarOpen && !isMobile ? item.name : ""}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                    {((!isMobile && isSidebarOpen) || isMobile) && (
                      <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${(!isMobile && !isSidebarOpen) ? "justify-center" : "justify-start"
                } space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200`}
              title="Đăng xuất"
            >
              <FaSignOutAlt className="flex-shrink-0" />
              {((!isMobile && isSidebarOpen) || isMobile) && <span>Đăng xuất</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left side - Toggle */}
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <FaBars className="w-6 h-6" />
              </button>
            </div>

            {/* Right side - User */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
                  <span className="text-indigo-700 font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
