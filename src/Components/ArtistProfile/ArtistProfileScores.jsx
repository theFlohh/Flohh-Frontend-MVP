import React from "react";

const ArtistProfileScores = ({ artist }) => {
  const score = artist?.latestScore || {};
  const bestPlatform = artist.bestPlatform || {};
  const bestPlatformScore = artist.bestPlatformScore || {};
  const mostViewedPlatform = artist.mostViewedPlatform || {};
  const mostViews = artist.mostViews || {};
  const rank = artist.rank || {};
  const outOf = artist.outOf || {};
  const breakdown = score.breakdown || {};

  const showNum = (v) => (v == null || v === "" ? "N/A" : v);

  return (
    <div className="bg-[#1F223E] rounded-2xl p-6 w-full flex flex-col gap-8 shadow-lg">
      {/* Social Media Scores Grid */}
      <div>
        <div className="text-lg font-semibold text-white mb-4">
          Social Media Scores
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Score Cards */}
          {/* ... existing 9 cards unchanged ... */}
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/spotify.png"
              alt="Spotify"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(breakdown.spotify)} pts
            </div>
            <div className="text-gray-400 text-xs">Spotify Score</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/logos_youtube-icon.png"
              alt="YouTube"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(breakdown.youtube)} pts
            </div>
            <div className="text-gray-400 text-xs">YouTube Score</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/tiktok-icon.png"
              alt="TikTok"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(breakdown.tiktok)} pts
            </div>
            <div className="text-gray-400 text-xs">TikTok Score</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/chart-histogram.png"
              alt="Chartmetric"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(breakdown.chartmetric)}
            </div>
            <div className="text-gray-400 text-xs">Chartmetric</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/coins-01.png"
              alt="Engagement"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(score.engagementRate)}%
            </div>
            <div className="text-gray-400 text-xs">Engagement Rate</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/noto_fire.png"
              alt="Total Score"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(score.totalScore)}
            </div>
            <div className="text-gray-400 text-xs">Total Score</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/tiktok-icon.png"
              alt="TikTok Views"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(score.tiktokViews)} Million
            </div>
            <div className="text-gray-400 text-xs">TikTok Views</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/spotify.png"
              alt="Spotify Views"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(score.spotifyStreams)} Million
            </div>
            <div className="text-gray-400 text-xs">Spotify Views</div>
          </div>
          <div className="bg-[#070a29] rounded-lg p-4 flex flex-col items-center">
            <img
              src="/img/chart-histogram.png"
              alt="Chartmetric Buzz"
              className="w-7 h-7 mb-1"
            />
            <div className="text-white font-semibold text-base">
              {showNum(score.chartmetricBuzz)}
            </div>
            <div className="text-gray-400 text-xs">Chartmetric Buzz</div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg">
        <div className="text-center text-white">
          <h3 className="text-sm font-semibold tracking-widest text-gray-300 mb-1">
            SUGGESTED FOR YOU
          </h3>
          {/* <p className="text-xs text-gray-400">token:music</p> */}
        </div>
        <div class="flex flex-row justify-center gap-6 bg-[#070a29] p-8">
          
          <div class="relative  p-4 bg-[#1b1f3b] rounded-xl shadow-lg text-center">
            <button class="absolute top-2 right-2 text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
            <img
              src="/img/p2.png"
              alt="Drake"
              class="mx-auto rounded-full object-cover"
            />
            <h2 class="mt-3 text-white text-sm font-semibold">Drake</h2>
            <button class="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
               Profile
            </button>
          </div>
          <div class="relative  p-4 bg-[#1b1f3b] rounded-xl shadow-lg text-center">
            <button class="absolute top-2 right-2 text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
            <img
              src="/img/p2.png"
              alt="Drake"
              class="mx-auto rounded-full object-cover"
            />
            <h2 class="mt-3 text-white text-sm font-semibold">Drake</h2>
            <button class="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
               Profile
            </button>
          </div>
          <div class="relative  p-4 bg-[#1b1f3b] rounded-xl shadow-lg text-center">
            <button class="absolute top-2 right-2 text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
            <img
              src="/img/p2.png"
              alt="Drake"
              class="mx-auto rounded-full object-cover"
            />
            <h2 class="mt-3 text-white text-sm font-semibold">Drake</h2>
            <button class="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
               Profile
            </button>
          </div>
          <div class="relative  p-4 bg-[#1b1f3b] rounded-xl shadow-lg text-center">
            <button class="absolute top-2 right-2 text-gray-400 hover:text-white text-sm font-bold">
              ✕
            </button>
            <img
              src="/img/p2.png"
              alt="Drake"
              class="mx-auto rounded-full object-cover"
            />
            <h2 class="mt-3 text-white text-sm font-semibold">Drake</h2>
            <button class="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
               Profile
            </button>
          </div>
        </div>
      </div>
      {/* Social Media Scores Details */}
      <div>
        <div className="text-lg font-semibold text-white text-gray-800 mb-4">
          Social Media Scores
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 bg-[#070a29] rounded-full px-4 py-2 text-white text-base font-medium">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 19V6h13" />
            </svg>
            {bestPlatform || "N/A"} :{" "}
            <span className="font-bold">{bestPlatformScore}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#070a29] rounded-full px-4 py-2 text-white text-base font-medium">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 17l4-4-4-4m8 8l-4-4 4-4" />
            </svg>
            Rank :{" "}
            <span className="font-bold">
              # {rank} Out of {outOf}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#070a29] rounded-full px-4 py-2 text-white text-base font-medium w-fit">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          Best Platform :
          <span className="font-bold">{mostViewedPlatform || "N/A"}</span>
        </div>
      </div>

      {/* Follow On */}
      <div className="mt-4">
        <div className="text-gray-500 text-sm mb-2">Follow on :</div>
        <div className="flex gap-4">
          {artist?.spotifyId && (
            <a
              href={`https://open.spotify.com/artist/${artist.spotifyId}`}
              className="bg-green-100 hover:bg-green-200 rounded-full p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/img/spotify.png" alt="Spotify" className="w-6 h-6" />
            </a>
          )}
          {artist?.youtubeChannelId && (
            <a
              href={`https://youtube.com/channel/${artist.youtubeChannelId}`}
              className="bg-red-100 hover:bg-red-200 rounded-full p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/logos_youtube-icon.png"
                alt="YouTube"
                className="w-6 h-6"
              />
            </a>
          )}
          {artist?.tiktokUsername && (
            <a
              href={`https://www.tiktok.com/@${artist.tiktokUsername}`}
              className="bg-pink-100 hover:bg-pink-200 rounded-full p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/tiktok-icon.png"
                alt="TikTok"
                className="w-6 h-6"
              />
            </a>
          )}
          {artist?.chartmetricId && (
            <a
              href={`https://app.chartmetric.com/artist/${artist.chartmetricId}`}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/img/chartmetric.png"
                alt="Chartmetric"
                className="w-6 h-6"
              />
            </a>
          )}
        </div>
      </div>

      {/* Suggested For You Section */}
    </div>
  );
};

export default ArtistProfileScores;
