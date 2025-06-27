import React from "react";
import { FaTimes } from "react-icons/fa";

const ArtistModal = ({ artist, onClose }) => {
  if (!artist) return null;

  const {
    name,
    latestScore,
    youtubeChannelId,
    spotifyId,
    chartmetricId,
  } = artist;

  const breakdown = latestScore?.breakdown || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-10 overflow-y-auto max-h-[90vh] transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl transition duration-200"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-6 relative inline-block after:content-[''] after:block after:w-12 after:h-1 after:bg-purple-400 after:mx-auto after:mt-2">
          {name}
        </h2>


        {/* Stats Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatBox label="Spotify Score" value={breakdown.spotify} />
          <StatBox label="YouTube Score" value={breakdown.youtube} />
          <StatBox label="TikTok Score" value={breakdown.tiktok} />
          <StatBox label="Chartmetric" value={breakdown.chartmetric} />
          <StatBox
            label="Engagement Rate"
            value={`${latestScore?.engagementRate ?? "0"}%`}
          />
          <StatBox label="Total Score" value={latestScore?.totalScore} />
          <StatBox
            label="TikTok Views"
            value={latestScore?.tiktokViews?.toLocaleString()}
          />
          <StatBox
            label="YouTube Views"
            value={latestScore?.youtubeViews?.toLocaleString()}
          />
          <StatBox
            label="Chartmetric Buzz"
            value={latestScore?.chartmetricBuzz?.toLocaleString()}
          />
        </div>

        {/* Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <InfoRow label="Spotify ID" value={spotifyId} />
          <InfoRow label="YouTube Channel" value={youtubeChannelId} />
          <InfoRow label="Chartmetric ID" value={chartmetricId} />
        </div>
      </div>
    </div>
  );
};

// Stat Card
const StatBox = ({ label, value }) => (
  <div className="bg-gray-50 border border-purple-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </div>
    <div className="text-lg font-semibold text-gray-800">{value ?? "N/A"}</div>
  </div>
);

// Label + Value Row
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 break-words">{value ?? "N/A"}</span>
  </div>
);

export default ArtistModal;
