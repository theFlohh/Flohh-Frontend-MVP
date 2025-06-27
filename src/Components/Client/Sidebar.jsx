import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiX, FiLogOut, FiHome, FiUser, FiGrid, FiSettings, FiHelpCircle, FiTrendingUp, FiUsers } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FiGrid /> },
  { path: "/my-team", label: "My Team", icon: <FiHome /> },
  { path: "/profile", label: "Artists", icon: <FiUser /> },
  { path: "/settings", label: "Settings", icon: <FiSettings /> },
  { path: "/support", label: "Support", icon: <FiHelpCircle /> },
    { path: "/leaderboard/global", label: "Global Leaderboard", icon: <FiTrendingUp /> },
  { path: "/leaderboard/friend", label: "Friends Leaderboard", icon: <FiUsers /> },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }
  const userName = user?.name || "User";
  const userRole = user?.role || "User";
  const userAvatar = user?.image || "/logo192.png";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      {/* Sidebar Panel */}
      <aside
        className={`h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          fixed top-0 left-0 md:static md:translate-x-0 md:block
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex items-center justify-between px-4 py-4 ">
          {/* <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"> */}
            {/* <img src="/logo192.png" alt="logo" className="w-6 h-6" /> */}
            {/* Artist Lineup. */}
          {/* </h2> */}
          <button className="md:hidden text-gray-600" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>
        <nav className="px-4  space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        {/* User Profile Section */}
        <div className="px-4 pb-6 mt-auto">
          <div className="flex items-center gap-3 mb-3 bg-gray-100 p-2 rounded-lg">
            <img src={userAvatar} alt="User" className="w-8 h-8 rounded-full border-2 border-purple-400" />
            <div>
              <div className="text-gray-800 font-semibold text-sm">{userName}</div>
              <div className="text-gray-400 text-xs">{userRole}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-red-600 transition"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
