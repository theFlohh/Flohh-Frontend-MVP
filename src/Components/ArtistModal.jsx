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
    image,
  } = artist;

  const breakdown = latestScore?.breakdown || {};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-[#1e294a]/95 rounded-2xl shadow-2xl w-full max-w-4xl p-8 sm:p-10 overflow-y-auto max-h-[90vh] transition-all duration-300 text-white border border-white/10 scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-400 text-2xl transition duration-200"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Artist Image */}
        <div className="flex items-center gap-3 p-2 rounded-lg transition">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-30 h-30 rounded-full object-cover"
          />
          <h2 className="text-white font-bold text-3xl">{artist.name}</h2>
        </div>

        {/* Stats Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
          <StatBox
            icon="/img/spotify.png"
            value={breakdown.spotify}
            label="Spotify"
          />
          <StatBox
            icon="/img/logos_youtube-icon.png"
            value={breakdown.youtube}
            label="YouTube"
          />
          <StatBox
            icon="/img/tiktok-icon.png"
            value={breakdown.tiktok}
            label="TikTok"
          />
          <StatBox
            icon="/img/chart-histogram.png"
            value={breakdown.chartmetric}
            label="Chartmetric"
          />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm border-t border-white/10 pt-6">
          <InfoRow label="Spotify ID" value={spotifyId} />
          <InfoRow label="YouTube Channel" value={youtubeChannelId} />
          <InfoRow label="Chartmetric ID" value={chartmetricId} />
        </div>
      </div>
    </div>
  );
};

// Stat Card with Icon Option
const StatBox = ({ label, value, icon }) => (
  <div className="bg-[#27345d] rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col items-center justify-center text-center min-h-[110px] border border-white/5">
    {icon && <img src={icon} alt="icon" className="w-8 h-8 mb-2 opacity-90" />}
    {label && !icon && (
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </div>
    )}
    <div className="text-lg font-semibold text-white">{value ?? "N/A"}</div>
    {icon && <div className="mt-1 text-xs text-gray-400">{label}</div>}
  </div>
);

// Label + Value Row
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col bg-[#27345d] p-3 rounded-lg border border-white/5">
    <span className="text-gray-400 font-medium mb-1">{label}</span>
    <span className="text-white break-words">{value ?? "N/A"}</span>
  </div>
);

export default ArtistModal;
