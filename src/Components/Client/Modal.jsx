import React from "react";

const Modal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-xl animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Notification</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
