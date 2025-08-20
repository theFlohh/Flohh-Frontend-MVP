import React, { useState } from "react";

const TeamSidebar = ({ tiers, selected, locked, onRemove, onConfirm, saving, teamIsComplete }) => {
  const [swipedArtistId, setSwipedArtistId] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
const a = selected;
console.log(a,"selected")
  const teamIsEmpty = Object.values(selected).every((arr) => arr.length === 0);
  if (teamIsEmpty) return null;

  return (
    <div className={`w-full md:w-1/3 rounded-2xl shadow-lg p-4 flex flex-col gap-4 h-fit relative ${locked ? "opacity-60 pointer-events-none" : ""}`}>
      {locked && <div className="absolute inset-0  bg-opacity-60 z-10 rounded-2xl" />}
      <h3 className="text-lg font-bold text-white mb-2">Your Team</h3>
      {tiers.map((tier) => (
        <div key={tier.value} className="mb-2">
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            {tier.label}
            {!tier.required && <span className="text-gray-400 ml-1">(Optional)</span>}
            <span className="ml-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {selected[tier.value].length}/{tier.max}
            </span>
          </div>
          {selected[tier.value].map((artist) => (
            <div
              key={artist._id}
              className={`group relative flex items-center rounded-lg overflow-hidden mb-2 transition-all duration-300 `}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
              onTouchEnd={() => {
                const swipeDistance = touchStartX - touchEndX;
                if (swipeDistance > 50) { setSwipedArtistId(artist._id); } else { setSwipedArtistId(null); }
              }}
            >
              <div className="flex items-center gap-6 p-2 flex-grow z-10">
                <img
                  src={artist?.artistId?.image || artist?.image || "/logoflohh.png"}
                  alt={artist.name}
                  className="w-16 h-16 rounded-sm object-cover border border-gray-300"
                />
                <div className="flex flex-col flex-grow">
                  <div className="text-white font-semibold text-xl">{artist?.name || artist?.artistId?.name || "Unknown"}</div>
                  <div className="text-gray-500 text-xs">{artist.type || tier.label} Artist</div>
                </div>
              </div>
              <div className={`absolute right-0 top-0 h-full z-20 transition-transform duration-300 transform ${swipedArtistId === artist._id ? "translate-x-0" : "translate-x-full"} md:translate-x-full md:group-hover:translate-x-0`}>
                <button
                  className={`h-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-5 rounded-l-lg transition-all ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !locked && onRemove(tier.value, artist._id)}
                  disabled={locked}
                  title={locked ? "You can edit your team after 12 hours." : "Remove"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-1 4v10m-4-10v10m-4-10v10m1 4h6a2 2 0 002-2V6H5v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={onConfirm}
        className={`mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition ${!teamIsComplete || saving || locked ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={!teamIsComplete || saving || locked}
      >
        {saving ? "Saving..." : "Confirm Your Final Lineup"}
      </button>
    </div>
  );
};

export default TeamSidebar;


