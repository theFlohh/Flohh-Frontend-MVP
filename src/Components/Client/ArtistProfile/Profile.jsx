import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ team }) => {
  const navigate = useNavigate();
  // Example fallback data
  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];
  return (
    <div className="bg-white rounded-xl p-0 w-full max-w-xs flex flex-col items-center mx-auto md:mx-0 shadow-md overflow-hidden">
      <div className="w-full bg-gray-100 flex flex-col items-center p-6 pb-4">
        <img src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt={user.name || "User"} className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow" />
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          {user.name || "My Team"} <span className="ml-1 text-purple-400 text-base">●</span>
        </h2>
        <div className="text-gray-500 text-sm mb-2">{user.type || "Team Type"}</div>
      </div>
      <div className="w-full bg-white p-4">
        <div className="text-xs text-gray-400 mb-2 font-semibold">MEMBERS</div>
        <ul className="divide-y divide-gray-200">
          {members.length > 0 ? members.map((m, idx) => (
            <li
              key={m.artistId?._id || idx}
              className="flex items-center justify-between text-gray-800 text-sm py-2 cursor-pointer hover:text-purple-600"
              onClick={() => navigate(`/artist/${m.artistId?._id}`)}
            >
              <span>{m.artistId?.name || "Artist"}</span> <span className="text-gray-400">&gt;</span>
            </li>
          )) : (
            <li className="text-gray-400 py-2">No members</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
