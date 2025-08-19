import React from "react";

const ConfirmModal = ({ selectedArtists, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-[#C89CFF] text-white rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
        {/* Artist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {selectedArtists.map((artist, index) => (
            <div
              key={index}
              className="bg-white text-black rounded-lg p-3 flex flex-col items-center justify-center w-full shadow"
            >
              <img
                src={artist.artistId?.image || artist?.image || "/logoflohh.png"}
                alt={artist.name}
                className="w-12 h-12 object-cover rounded-full mb-2"
              />
              <div className="text-xs font-semibold text-center">
                {artist?.name || artist?.artistId?.name || "Unknown"}
              </div>
              <div className="text-[10px] text-gray-500 text-center">
                {artist.type || "American rapper"}
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <p className="text-center text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">
          No edits after submission.
          <br className="hidden sm:block" />
          Finalize this team?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#8F5CFF] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-full font-semibold transition"
          >
            YES
          </button>
          <button
            onClick={onCancel}
            className="bg-white text-[#8F5CFF] border-2 border-[#8F5CFF] hover:bg-purple-100 px-6 py-2 rounded-full font-semibold transition"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
