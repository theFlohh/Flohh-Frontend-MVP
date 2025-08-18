import React from "react";
import { Link } from "react-router-dom";

const LeaderboardRow = ({ item, rank, rankIcons, entity }) => {
  const displayName = item.name || item.email || "Unknown";
  const score = entity === "artists" ? (item.totalScore || 0) : (item.totalPoints || 0);
  const imageUrl = item.image || null;
  const initial = (displayName && displayName.charAt(0).toUpperCase()) || "?";

  const isArtist = entity === "artists";
  const artistId = item.id || item._id;

  const rowClassName = "bg-[#1e294a] rounded-full flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-md transition-colors hover:bg-[#27345d]";

  const content = (
    <>
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <div className="flex flex-col items-center">
          {rank < 3 ? (
            <img
              src={rankIcons[rank]}
              alt={`Rank ${rank + 1}`}
              className="w-8 h-8"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold">
              {rank + 1}
            </div>
          )}
        </div>

        <div className="w-[1px] h-10 bg-white opacity-30 hidden sm:block" />

        <div className="flex items-center gap-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${displayName} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#121e3f] text-white flex items-center justify-center font-semibold">
              {initial}
            </div>
          )}
          <div>
            <h2 className="text-white font-semibold">{displayName}</h2>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {entity === "artists" ? "Artist" : "User"}
      </p>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <img
          src="/img/game-icons_two-coins.png"
          alt="coin"
          className="w-5 h-5 object-contain"
        />
        <span className="text-yellow-300 font-semibold">
          {Number(score).toLocaleString()} pts
        </span>
      </div>
    </>
  );

  if (isArtist && artistId) {
    return (
      <Link to={`/artist/${artistId}`} className={rowClassName}>
        {content}
      </Link>
    );
  }

  return <div className={rowClassName}>{content}</div>;
};

export default LeaderboardRow;


