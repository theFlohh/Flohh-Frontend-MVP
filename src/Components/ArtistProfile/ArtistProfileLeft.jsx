import React from "react";
import { useNavigate } from "react-router-dom";

const ArtistProfileLeft = ({ artist }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl w-full max-w-xs flex flex-col items-center mx-auto md:mx-0 shadow-lg overflow-hidden p-0">
      {/* Header with back button and titles */}
      <div className="w-full flex flex-col gap-1 px-6 pt-6 pb-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 mb-2"
          onClick={() => navigate(-1)}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="text-lg font-semibold text-gray-800">Artist Details</div>
        <div className="text-xs text-gray-400 mb-2">Artist profiles & stats</div>
      </div>
      {/* Profile Card */}
      <div className="w-full flex flex-col items-center px-6 pb-0">
        <img src={artist?.image || "/logo192.png"} alt={artist?.name || "Artist"} className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow" />
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
          {artist?.name || "Artist Name"} <span className="ml-1 text-purple-400 text-base">●</span>
        </h2>
        {artist?.type && <div className="text-gray-500 text-sm mb-2">{artist.type}</div>}
        {artist?.spotifyId && <div className="text-xs text-gray-400 mb-1">Spotify ID: {artist.spotifyId}</div>}
        {artist?.youtubeChannelId && <div className="text-xs text-gray-400 mb-1">YouTube: {artist.youtubeChannelId}</div>}
        {artist?.chartmetricId && <div className="text-xs text-gray-400 mb-1">Chartmetric: {artist.chartmetricId}</div>}
      </div>
      {/* Trending Score */}
      <div className="w-full flex flex-col items-center px-6">
        <div className="text-xs text-gray-400 mb-1 font-semibold">TRENDING SCORE</div>
        <div className="flex items-center gap-2 mb-2 bg-gray-100 rounded-lg px-3 py-2 w-full justify-center">
          <span className="text-2xl">🔥</span>
          <span className="text-gray-800 text-sm font-semibold">
            {artist?.latestScore?.popularityRank ? `Popularity Score #${artist.latestScore.popularityRank}` : "No score"}
          </span>
        </div>
      </div>
      {/* Top Songs */}
      {artist?.topSongs?.length > 0 && (
        <div className="w-full px-6 pb-6">
          <div className="text-xs text-gray-400 mb-2 font-semibold">TOP SONGS</div>
          <ul className="divide-y divide-gray-200">
            {artist.topSongs.map((song, idx) => (
              <li key={idx} className="flex items-center justify-between text-gray-800 text-sm py-2">
                <span>{idx + 1}. {song}</span> <span className="text-gray-400">&gt;</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ArtistProfileLeft; 