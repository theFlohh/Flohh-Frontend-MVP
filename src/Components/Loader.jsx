import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
      <svg className="animate-spin h-10 w-10 text-purple-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <div className="text-purple-600 font-semibold text-lg mt-2">Loading...</div>
    </div>
  </div>
);

export default Loader; 