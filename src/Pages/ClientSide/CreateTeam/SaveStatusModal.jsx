import React, { useEffect, useState } from "react";

const SaveStatusModal = ({ type, message, onClose, unlockAt }) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!unlockAt) return;
    const target = new Date(unlockAt).getTime();
    const t = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      setRemaining(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(t);
  }, [unlockAt]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-all">
      <div className={`bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center max-w-xs w-full border-t-4 ${type === "success" ? "border-green-500" : "border-red-500"} animate-fade-in-scale`}>
        <div className={`text-3xl mb-2 ${type === "success" ? "text-green-500" : "text-red-500"}`}>
          {type === "success" ? "✔️" : "❌"}
        </div>
        <div className={`text-center font-semibold text-lg mb-2 ${type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
        {unlockAt && <div className="text-sm text-gray-600">Unlocks in: {remaining}</div>}
        <button onClick={onClose} className="mt-3 px-4 py-1 bg-gray-200 hover:bg-purple-100 hover:text-purple-700 rounded text-gray-700 font-medium text-sm transition cursor-pointer">Close</button>
      </div>
      <style>{`
        @keyframes fade-in-scale { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fade-in-scale 0.25s cubic-bezier(0.4,0,0.2,1); }
      `}</style>
    </div>
  );
};

export default SaveStatusModal;
