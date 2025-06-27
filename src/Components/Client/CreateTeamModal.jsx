import React, { useState } from "react";

const CreateTeamModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300">
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative z-10 animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Team</h2>
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg">N</div>
            <div>
              <div className="text-gray-800 font-semibold">NFAK</div>
              <div className="text-gray-500 text-xs">Pakistani Pop Singer</div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg">T</div>
            <div>
              <div className="text-gray-800 font-semibold">Talha Anjum</div>
              <div className="text-gray-500 text-xs">Pakistani Pop Singer</div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-lg">A</div>
            <div>
              <div className="text-gray-800 font-semibold">Asim Azhar</div>
              <div className="text-gray-500 text-xs">Pakistani Pop Singer</div>
            </div>
          </div>
        </div>
        <button className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition">Create Team</button>
      </div>
    </div>
  );
};

export default CreateTeamModal;
