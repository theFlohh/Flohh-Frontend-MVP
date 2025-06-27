import React from "react";
import { FiChevronLeft } from "react-icons/fi";

const Navbar = ({ onSidebarToggle }) => {
  return (
    <nav className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        {/* <img src="/logo192.png" alt="logo" className="w-6 h-6" /> */}
        <span className="text-gray-800 font-bold text-lg">Artist Lineup.</span>
        <button
          className="ml-4 p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 transition md:hidden"
          onClick={onSidebarToggle}
          aria-label="Toggle Sidebar"
        >
          <FiChevronLeft size={18} />
        </button>
      </div>
      {/* <button className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-1 rounded-full font-medium transition text-sm">
        Log in
      </button> */}
    </nav>
  );
};

export default Navbar;
