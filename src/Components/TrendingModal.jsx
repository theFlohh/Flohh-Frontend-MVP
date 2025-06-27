import React from "react";

const TrendingModal = ({ artist, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-[90%] max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">{artist.name}'s Trending Stats</h2>
        <p><strong>Today:</strong> {artist.today}</p>
        <p><strong>Yesterday:</strong> {artist.yesterday}</p>
        <p><strong>Delta:</strong> {artist.delta}</p>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default TrendingModal;
