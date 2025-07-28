import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#2d2346] to-[#1a1333] z-50">
    <div className="bg-[#1F223E] rounded-2xl shadow-lg p-8 flex flex-col items-center">
      <svg className="animate-spin h-12 w-12 text-purple-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <div className="text-purple-400 font-semibold text-base mt-2">Loading...</div>
    </div>
  </div>
);

export default Loader;