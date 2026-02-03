import React, { useState } from "react";
import axios from "../services/axiosConfig";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFolder,
  FaCalendar,
  FaFileAlt,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

const COLORS = {
  green: "#2d5a27",
  brown: "#5D4E37",
  brownDark: "#3d3226",
  cream: "#f8f5f0",
  creamDark: "#ebe5dc",
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const navigationItems = [
    { id: "dashboard", name: "Dashboard", icon: FaHome, path: "/admin-dashboard" },
    { id: "book", name: "Product", icon: FaUsers, path: "/admin-dashboard/books" },
    // { id: "author", name: "Author", icon: FaFolder, path: "/admin-dashboard/authors" },
    { id: "category", name: "Category", icon: FaCalendar, path: "/admin-dashboard/categories" },
    { id: "order", name: "Order", icon: FaFileAlt, path: "/admin-dashboard/orders" },
  ];

  const handleLogout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      className="flex h-screen text-[#2d2d2d]"
      style={{ backgroundColor: COLORS.cream }}
    >
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
        style={{
          background: `linear-gradient(180deg, ${COLORS.brownDark}, ${COLORS.brown})`,
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img
            src="/images/waste_to_worth_logo.png"
            alt="logo"
            className="w-9 h-9"
          />
          {isSidebarOpen && (
            <span className="text-lg font-bold text-white tracking-wide">
              Admin Panel
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = activeItem === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${active ? "text-white shadow-lg" : "text-white/80 hover:text-white"}
                `}
                style={{
                  backgroundColor: active ? COLORS.green : "transparent",
                }}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: "#7a3e2e" }}
          >
            <FaSignOutAlt />
            {isSidebarOpen && "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 py-4 shadow-sm"
          style={{ backgroundColor: COLORS.creamDark }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-black/5"
          >
            <FaBars />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: COLORS.green }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="font-medium">{user?.name || "Admin"}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-180px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
