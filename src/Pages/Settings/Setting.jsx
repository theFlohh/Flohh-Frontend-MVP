import React from "react";
import { Link } from "react-router-dom";

const ComingSoonCard = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="bg-gradient-to-br from-[#2d2346] to-[#1a1333] rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center border border-purple-700/30">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600/20 mb-3">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M12 8v4l3 2" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Coming Soon</h2>
      <p className="text-purple-200 text-center mb-3 text-sm">
        This feature is under development.<br />
        Stay tuned for awesome updates!
      </p>
      {/* <span className="inline-block bg-purple-700/20 text-purple-300 text-xs px-4 py-1 rounded-full font-semibold tracking-wide mb-4">
        Settings
      </span> */}
      <Link
        to="/"
        className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold text-sm shadow hover:from-purple-600 hover:to-pink-500 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default ComingSoonCard;