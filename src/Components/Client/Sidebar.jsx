import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiX,
  FiLogOut,
  FiHome,
  FiUser,
  FiGrid,
  FiSettings,
  FiHelpCircle,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
// import {
//   FiX,
//   FiLogOut,
//   FiHome,
//   FiUser,
//   FiGrid,
//   FiSettings,
//   FiHelpCircle,
//   FiTrendingUp,
//   FiUsers,
// } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const navItems = [
  { path: "/my-team", label: "My Team", icon: <FiHome /> },
  { path: "/artist", label: "Artists", icon: <FiUser /> },
  { path: "/", label: "Dashboard", icon: <FiGrid /> },
  { path: "/settings", label: "Settings", icon: <FiSettings /> },
  { path: "/support", label: "Support", icon: <FiHelpCircle /> },
  {
    path: "/leaderboard/global",
    label: "Global Leaderboard",
    icon: <FiTrendingUp />,
  },
  {
    path: "/leaderboard/friend",
    label: "Friends Leaderboard",
    icon: <FiUsers />,
  }
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [showLeaderboardDropdown, setShowLeaderboardDropdown] = useState(false);

  // const [showLeaderboardDropdown, setShowLeaderboardDropdown] = useState(false);

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
        className={`w-64 shadow-lg z-40 bg-[#1F223E] flex flex-col justify-between fixed top-0 left-0 md:static md:translate-x-0 md:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        // className={`w-64 shadow-lg z-40 bg-[#1F223E] flex flex-col justify-between fixed top-0 left-0 md:static md:translate-x-0 md:block ${
        //   isOpen ? "translate-x-0" : "-translate-x-full"
        // }`}
      >
        <div>
          <button
            className="md:hidden text-white p-4"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
          {/* <nav
            className="px-4 space-y-2 flex-1 text-white overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
          <button
            className="md:hidden text-white p-4"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button> */}
          <nav
            className="px-4 space-y-2 flex-1 text-white overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition 
      ${
        location.pathname === item.path
          ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
          : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] hover:text-white "
      }`}
      //           className={`flex items-center gap-3 px-3 py-2 rounded-full transition 
      // ${
      //   location.pathname === item.path
      //     ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
      //     : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] hover:text-white "
      // }`}
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
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition 
      ${
        location.pathname === item.path
          ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
          : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] hover:text-white "
      }`}
      //           className={`flex items-center gap-3 px-3 py-2 rounded-full transition 
      // ${
      //   location.pathname === item.path
      //     ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
      //     : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] hover:text-white "
      // }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {/* Divider line */}
            {/* <div className="my-3 mx-4 border-t border-white opacity-60" /> */}
            {/* <div className="my-3 mx-4 border-t border-white opacity-60" /> */}
          </nav>
        </div>
        {/* Bottom nav items and profile/logout */}
        <div className="px-4 space-y-2 mb-4">
          {/* Leaderboard Dropdown Toggle */}
          <button
            className="flex items-center justify-between w-full px-3 py-2 rounded-full transition hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] text-white"
            onClick={() => setShowLeaderboardDropdown(!showLeaderboardDropdown)}
          >
            <span className="flex items-center gap-3  ">
              <FiTrendingUp />
              Leaderboard
            </span>
            {showLeaderboardDropdown ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {/* Dropdown Items */}
          {showLeaderboardDropdown && (
            <div className="ml-6 space-y-2 transition-all duration-300">
              {navItems.slice(5).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition text-sm 
    ${
      location.pathname === item.path
        ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
        : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] text-white"
    }`}
                  onClick={() => {
                    setIsOpen(false);
                    setShowLeaderboardDropdown(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          )}
                      <div className="my-3 mx-4 border-t border-white opacity-60" />

        <div className="pb-6 pt-2 mx-auto">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-lg" onClick={() => navigate("/profile-setting")}>
            <img
              src={userAvatar}
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-purple-400"
            />
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
