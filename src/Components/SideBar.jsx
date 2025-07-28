import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiX, FiLogOut, FiHome, FiUser, FiGrid, FiSettings, FiHelpCircle, FiTrendingUp, FiUsers } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

const navItems = [
  { path: "/my-team", label: "My Team", icon: <FiHome /> },
  { path: "/profile", label: "Artists", icon: <FiUser /> },
  { path: "/", label: "Dashboard", icon: <FiGrid /> },
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
  const userAvatar = user?.image || "/logoflohh.png";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-[#1F223E] bg-opacity-40 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      {/* Sidebar Panel */}
      <aside
        className={`w-64 shadow-lg z-40 bg-[#1F223E] flex flex-col justify-between fixed top-0 left-0 md:static md:translate-x-0 md:block ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4 ">
            <button className="md:hidden text-white" onClick={() => setIsOpen(false)}>
              <FiX size={24} />
            </button>
          </div>
          {/* Nav section scrollable */}
          <nav className="px-4 space-y-2 flex-1 text-white overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
            {/* First 3 nav items */}
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition hover:bg-gray-100 hover:text-black ${
                  location.pathname === item.path ? "bg-gray-100 font-semibold text-black" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Divider line */}
            <div className="my-3 mx-4 border-t border-white opacity-60" />
            {/* Next 2 nav items */}
            {navItems.slice(3, 5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition hover:bg-gray-100 hover:text-black ${
                  location.pathname === item.path ? "bg-gray-100 font-semibold text-black" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Divider line */}
            <div className="my-3 mx-4 border-t border-white opacity-60" />
          </nav>
        </div>
        {/* Bottom nav items and profile/logout */}
        <div className="px-4 space-y-2 mb-4">
          {navItems.slice(5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-full transition hover:bg-gray-100 hover:text-black ${
                  location.pathname === item.path ? "bg-gray-100 font-semibold text-black" : ""
                }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          {/* User Profile Section */}
          <div className="pb-6 pt-2">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-lg">
              <img src={userAvatar} alt="User" className="w-8 h-8 rounded-full border-2 border-purple-400" />
              <div>
                <div className="text-white font-semibold text-sm">{userName}</div>
                <div className="text-gray-400 text-xs">{userRole}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
