// Modal.jsx
import React from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-[#1F223E] to-[#2A2D4A] rounded-2xl shadow-2xl text-white overflow-hidden">
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
          onClick={onClose}
        >
          <IoClose size={26} />
        </button>
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
