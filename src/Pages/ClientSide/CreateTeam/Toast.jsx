// Toast.jsx
import React from "react";

const Toast = ({ message, type }) => {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-gray-700";

  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded text-white shadow-lg z-50 ${bgColor}`}>
      {message}
    </div>
  );
};

export default Toast;
