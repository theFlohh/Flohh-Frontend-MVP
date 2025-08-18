// TeamPanel.jsx
import React from "react";

const TeamPanel = ({ team, removeFromTeam }) => {
  return (
    <div className="bg-[#865DFF] p-3 text-white rounded-lg space-y-2">
      <h2 className="text-lg font-semibold mb-2">Your Team</h2>
      {["Legends", "Trending", "Underrated"].map((tier) => (
        <div key={tier} className="mb-2">
          <h3 className="font-bold">{tier}</h3>
          {team[tier]?.length ? (
            team[tier].map((artist) => (
              <div key={artist._id} className="flex justify-between items-center bg-[#E384FF] px-2 py-1 rounded mt-1">
                <span>{artist.name}</span>
                <button
                  onClick={() => removeFromTeam(tier, artist._id)}
                  className="text-sm bg-red-500 text-white rounded px-2"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-100">No artist selected</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamPanel;
