import React, { useState, useMemo } from "react";
import { FaEye } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const DataTable = ({ data, onView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return (
      data
        //   .map((artist) => {
        //     const breakdown = artist.latestScore?.breakdown || {};
        //     const totalScore =
        //       (breakdown.youtube || 0) +
        //       (breakdown.spotify || 0) +
        //       (breakdown.tiktok || 0);

        //     return {
        //       ...artist,
        //       totalScore,
        //     };
        //   })
        .filter((artist) => {
          const nameMatch = artist.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const genreMatch = artist.genres?.some((genre) =>
            genre.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return nameMatch || genreMatch;
        })
        .sort((a, b) => {
          const aVal = Number(a.chartmetricId) || 0;
          const bVal = Number(b.chartmetricId) || 0;
          if (sortOrder === "asc") {
            return aVal - bVal;
          } else {
            return bVal - aVal;
          }
        })
    );
  }, [data, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search artist or genre..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSortToggle}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Sort by Total Score ({sortOrder.toUpperCase()})
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Artist</th>
              <th className="px-6 py-3 text-left font-bold">Genres</th>
              <th className="px-6 py-3 text-left font-bold">
                chartmetricId
              </th>{" "}
              {/* changed here */}
              <th className="px-6 py-3 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((artist) => (
              <tr
                key={artist._id}
                className="hover:bg-indigo-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {artist.name}
                </td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                  {artist.genres?.join(", ") || "-"}
                </td>
                <td className="px-6 py-4 text-indigo-600 font-semibold whitespace-nowrap">
                  {artist.chartmetricId || "-"} {/* changed here */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onView(artist._id)}
                    className="text-indigo-600 hover:text-indigo-900 text-lg"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 flex-wrap gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition duration-150 ${
              currentPage === index + 1
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
