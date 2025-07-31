import React from "react";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-[#1F223E] shadow">
      <div className="flex items-center gap-2">
        <img src="/img/Logo.png" alt="logo" className="w-6 h-6" />
        <span className="text-white font-bold text-lg"> Artist Lineup.</span>
        <button
          className="ml-4 p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 transition md:hidden"
          onClick={onSidebarToggle}
          aria-label="Toggle Sidebar"
        >
          <FiChevronLeft size={18} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <FiLogOut /> Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
