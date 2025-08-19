import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUpload, FiLogOut, FiHome } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/admin/artists", label: "Artists", icon: <FiUpload /> },
    { path: "/all-users", label: "Users", icon: <FiUpload /> },
    { path: "/add-artist-csv", label: "CSV Upload", icon: <FiUpload /> },
  ];

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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 bg-[#1F223E] text-white p-2 rounded shadow"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`w-64 shadow-lg z-40 bg-[#1F223E] flex flex-col justify-between fixed top-0 left-0 md:static md:translate-x-0 md:block ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div>
          {/* Close Button (Mobile) */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
            <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav
            className="px-4 space-y-2 flex-1 text-white overflow-y-auto mt-4"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition 
                  ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold"
                      : "hover:bg-gradient-to-r hover:from-[#794AFE] hover:to-[#B292FF] hover:text-white"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-full transition bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
