import React from "react";

const StatusToast = ({ message, onClose }) => {
  const isAlready = message?.includes("Already");
  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${isAlready ? "bg-yellow-500" : "bg-green-500"} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
        </svg>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 font-bold">
          ×
        </button>
      </div>
    </div>
  );
};

export default StatusToast;


