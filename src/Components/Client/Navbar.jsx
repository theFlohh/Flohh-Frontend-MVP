import React from "react";
import { FiChevronLeft, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let localUser = null;
  try {
    localUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    localUser = null;
  }
  const userName = localUser?.name || user?.name || "User";
  const userAvatar = localUser?.image || user?.image || "/logoflohh.png";

  const isNewPage = location.pathname === "/"; // Check if route is "/new"

  return (
    <nav className="w-full flex items-center px-4 py-3 bg-[#1F223E] shadow">
      {/* Left Side */}
      <div className="flex items-center gap-2 w-full md:w-1/4">
        <img src="/img/logo1.png" alt="logo" className="w-6 h-6" />
        <span className="text-white font-bold text-lg">FLOHH</span>
        <button
          className="ml-4 p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 transition md:hidden flex flex-end"
          onClick={onSidebarToggle}
          aria-label="Toggle Sidebar"
        >
          <FiChevronLeft size={18} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 justify-end w-full">
        {isNewPage ? (
          // Special Navbar for "/new" route
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={userAvatar}
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-purple-400"
              />
              <span className="text-white font-semibold">{userName}</span>
            </div>
            <div className="gap-3 flex">
              <button className="text-white hover:text-purple-400 border-r border-gray-300 pr-3"
              onClick={() => navigate("/settings")}>
                <FiSettings size={24} />
              </button>

              <button className="text-white hover:text-purple-400 border rounded-full p-1">
                <FiUser size={24} />
              </button>
            </div>
          </div>
        ) : (
          // Default Navbar for other pages
          user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 
             bg-gradient-to-r from-[#794AFE] to-[#B292FF] 
             text-white rounded-full 
             hover:from-pink-600 hover:to-purple-600 
             transition duration-300 ease-in-out"
            >
              <FiLogOut /> Logout
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
