import React, { useState, useMemo } from "react";
import { FaEye } from "react-icons/fa";

const DataTable = ({ data, onView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredData = useMemo(() => {
    return data
      .filter((artist) => {
        const nameMatch = artist.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const genreMatch = artist.genres?.some((genre) =>
          genre.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return nameMatch || genreMatch;
      })
      .sort((a, b) => {
        const aVal = Number(a.chartmetricId) || 0;
        const bVal = Number(b.chartmetricId) || 0;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
  }, [data, searchQuery, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-[#131634] rounded-xl shadow-lg">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="Search artist or genre..."
          className="px-4 py-2 rounded-full bg-[#1e294a] text-white placeholder-gray-400 border border-transparent focus:border-purple-500 outline-none w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSortToggle}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold hover:opacity-90 transition-all"
        >
          Sort by Total Score ({sortOrder.toUpperCase()})
        </button>
      </div>

      {/* Leaderboard-Style Rows */}
      <div className="space-y-3">
        {filteredData.length > 0 ? (
          filteredData.map((artist, index) => (
            <div
              key={artist._id}
              className="bg-[#1e294a] rounded-full flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-md transition-colors hover:bg-[#27345d]"
            >
              <div className="flex items-center gap-4">
                {/* Rank Number */}
                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                {/* Artist Image */}
                {artist.image && (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-500"
                  />
                )}

                {/* Divider */}
                <div className="hidden sm:block w-[1px] h-10 bg-white opacity-30" />

                {/* Artist Info */}
                <div>
                  <h2 className="text-white font-semibold">{artist.name}</h2>
                  <p className="text-gray-400 text-sm">
                    {artist.genres?.join(", ") || "-"}
                  </p>
                </div>
              </div>

              {/* Score & View Button */}
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-blue-400 font-semibold">
                  {artist.chartmetricId || "-"}
                </span>
                <button
                  onClick={() => onView(artist._id)}
                  className="text-green-500 hover:text-indigo-300 text-lg"
                  title="View Details"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 font-medium">
            No artists found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
  