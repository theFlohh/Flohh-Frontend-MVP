import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUpload, FiLogOut, FiHome, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
    {
      path: "/add-artist-csv",
      label: "Add Artist via CSV",
      icon: <FiUpload />,
    },
    { path: "/trending", label: "Trending", icon: <FiUpload /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                location.pathname === item.path
                  ? "bg-gray-100 font-semibold"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
