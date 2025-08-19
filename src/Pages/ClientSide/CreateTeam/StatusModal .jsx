// StatusModal.jsx
import React from "react";

const StatusModal = ({ show, statusMessage, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-lg p-6 shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Team Status</h2>
        <p className="mb-6">{statusMessage}</p>
        <button
          onClick={onClose}
          className="bg-[#865DFF] text-white px-4 py-2 rounded hover:bg-[#6c4ddf] transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatusModal;
