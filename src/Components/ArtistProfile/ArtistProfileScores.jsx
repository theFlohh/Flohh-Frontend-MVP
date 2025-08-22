import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllArtists } from "../../Services/Api";

const ArtistProfileScores = ({ artist }) => {
  const navigate = useNavigate();
  const [suggestedArtists, setSuggestedArtists] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSuggestions = async () => {
      setLoading(true);
      try {
        const allArtists = await fetchAllArtists();
        const randomArtists = allArtists
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setSuggestedArtists(randomArtists);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        setLoading(false);
      }
    };

    getSuggestions();
  }, []);

  const handleRemove = (id) => {
    setRemovedIds((prev) => [...prev, id]);
  };

  const filteredArtists = suggestedArtists.filter(
    (artist) => !removedIds.includes(artist._id)
  );

  const score = artist?.latestScore || {};
  const bestPlatform = artist.bestPlatform || "N/A";
  const bestPlatformScore = artist.bestPlatformScore || "N/A";
  const mostViewedPlatform = artist.mostViewedPlatform || "N/A";
  const rank = artist.rank || "N/A";
  const outOf = artist.outOf || "N/A";
  const breakdown = score.breakdown || {};

  const showNum = (v) => (v == null || v === "" ? "N/A" : v);

  return (
    <div className="bg-[#131634] rounded-2xl p-4 sm:p-6 w-full flex flex-col shadow-lg">
      {/* Social Media Scores */}
      <div>
        <div className="text-lg font-semibold text-white mb-4">
          Social Media Scores
        </div>
        <div className="flex flex-wrap gap-4 justify-start">
          {[
            {
              label: "Spotify Score",
              icon: "spotify.png",
              value: breakdown.spotify,
            },
            {
              label: "YouTube Score",
              icon: "logos_youtube-icon.png",
              value: breakdown.youtube,
            },
            {
              label: "TikTok Score",
              icon: "tiktok-icon.png",
              value: breakdown.tiktok,
            },
            {
              label: "Chartmetric",
              icon: "chart-histogram.png",
              value: breakdown.chartmetric,
            },
            {
              label: "Engagement Rate",
              icon: "coins-01 (2).png",
              value: `${score.engagementRate}%`,
            },
            {
              label: "Total Score",
              icon: "noto_fire.png",
              value: `${score.totalScore}`,
            },
            {
              label: "TikTok Views",
              icon: "tiktok-icon.png",
              value: `${score.tiktokViews} M`,
            },
            {
              label: "Spotify Views",
              icon: "spotify.png",
              value: `${score.spotifyStreams} M`,
            },
            {
              label: "Chartmetric Buzz",
              icon: "chart-histogram.png",
              value: score.chartmetricBuzz,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex flex-row gap-3 items-center justify-start bg-[#353751] rounded-lg p-4 flex-grow sm:flex-none sm:basis-[48%] md:basis-[30%] xl:basis-[31%] h-[80px] shadow-md"
            >
              <img
                src={`/img/${card.icon}`}
                alt={card.label}
                className="w-8 h-8 object-contain"
              />
              <div className="flex flex-col items-start gap-1">
                {/* Label only shows on small screens and up */}
                <div className="text-gray-400 text-sm sm:text-md hidden sm:block">
                  {card.label}
                </div>
                <div className="text-white text-md sm:text-lg">
                  {showNum(card.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-10 w-full">
          <img
            src="/img/logo1.png"
            alt="Loading..."
            className="w-12 h-12 animate-spin rounded-full border-2 border-purple-500"
          />
        </div>
      )}

      {/* Suggested For You */}
      {filteredArtists.length > 0 && (
        <div className="mt-6">
          <div className="text-white">
            <h3 className="text-md font-semibold mb-3">SUGGESTED FOR YOU</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {filteredArtists.map((artist) => (
              <div
                key={artist._id}
                className="relative p-4 bg-[#353751] rounded-xl shadow-lg text-center w-full sm:w-[48%] md:w-[32%] xl:w-[23%]"
              >
                <button
                  onClick={() => handleRemove(artist._id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
                <img
                  src={artist.image || "/logoflohh.png"}
                  alt={artist.name}
                  className="mx-auto rounded-full object-cover w-20 h-20"
                />
                <h2 className="mt-3 text-white text-sm font-semibold">
                  {artist.name}
                </h2>
                <a
                  href={`/artist/${artist._id}`}
                  className="mt-3 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Media Score Details */}
      <div className="mt-6">
        <div className="text-lg font-semibold text-white mb-4">
          Social Media Scores
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 bg-[#2a2d48] rounded-full px-4 py-2 text-white text-sm sm:text-base font-medium">
            <img
              src="/img/music-note-04.png"
              alt="spotify"
              className="w-6 h-6"
            />
            {bestPlatform} :{" "}
            <span className="font-bold">{bestPlatformScore}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#2a2d48] rounded-full px-4 py-2 text-white text-sm sm:text-base font-medium">
            <img src="/img/ranking.png" alt="rank" className="w-6 h-6" />
            Rank :{" "}
            <span className="font-bold">
              # {rank} Out of {outOf}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#2a2d48] rounded-full px-4 py-2 text-white text-sm sm:text-base font-medium w-fit">
          <img src="/img/clock-04.png" alt="most viewed" className="w-6 h-6" />
          Best Platform :{" "}
          <span className="font-bold">{mostViewedPlatform}</span>
        </div>
      </div>

      {/* Follow on Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 text-white text-lg font-semibold flex-wrap">
          <span>Follow on :</span>
          <div className="flex gap-3 flex-wrap">
            {artist?.spotifyId && (
              <a
                href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                className="border border-[#353751] bg-[#2a2d48] hover:scale-110 rounded-full p-2 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/img/spotify.png" alt="Spotify" className="w-6 h-6" />
              </a>
            )}
            {artist?.youtubeChannelId && (
              <a
                href={`https://youtube.com/channel/${artist.youtubeChannelId}`}
                className="border border-[#353751] bg-[#2a2d48] hover:scale-110 rounded-full p-2 transition-all duration-200"
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
                className="border border-[#353751] bg-[#2a2d48] hover:scale-110 rounded-full p-2 transition-all duration-200"
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
                className="border border-[#353751] bg-[#2a2d48] hover:scale-110 rounded-full p-2 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/img/chart-histogram.png"
                  alt="Chartmetric"
                  className="w-6 h-6"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileScores;
