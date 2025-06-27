import React from "react";

const ScoringBoard = ({ team }) => {
  // Example fallback data
  const members = team?.teamMembers || [];
  return (
    <div className="bg-white rounded-xl p-6 w-full flex flex-col gap-6 shadow-md">
      <div className="flex flex-col gap-4 mb-4">
        {members.length > 0 ? members.map((m, idx) => (
          <div key={m.artistId?._id || idx} className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <img src={m.artistId?.image || 'https://randomuser.me/api/portraits/men/38.jpg'} alt={m.artistId?.name || 'Artist'} className="w-12 h-12 rounded-full object-cover border-2 border-purple-300" />
              <div>
                <div className="font-semibold text-gray-800 text-base">{m.artistId?.name || 'Artist Name'}</div>
                <div className="text-xs text-gray-500">{m.category || 'Category'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">{m.category || 'Type'}</span>
              <span className="text-yellow-500 font-bold flex items-center gap-1">
                <svg width="18" height="18" fill="currentColor" className="inline" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                {m.artistId?.points || '1,234,567'} pts
              </span>
            </div>
          </div>
        )) : (
          <div className="text-gray-400 text-center py-8">No team members found.</div>
        )}
      </div>
    </div>
  );
};

export default ScoringBoard;
