import React from "react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#2d2346] to-[#1a1333] z-50">
    <div className="bg-[#1F223E] rounded-2xl shadow-lg p-8 flex flex-col items-center">
      <img
        src="/img/loader.png"
        alt="Loading"
        className="h-12 w-12 animate-spin rounded-full mb-2 border-2 border-purple-500"
      />
      <div className="text-purple-400 font-semibold text-base mt-2">Loading...</div>
    </div>
  </div>
);

export default Loader;
