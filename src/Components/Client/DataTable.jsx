import React, { useEffect, useState } from "react";
import { fetchAllArtists } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 15; // 5 cards per row, 3 rows

const ArtistCard = ({ artist, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer flex flex-col items-center p-4 m-2 border border-gray-100 hover:border-purple-200 group"
    onClick={() => onClick(artist)}
    title={artist.name}
  >
    <img
      src={artist.image || "/logoflohh.png"}
      alt={artist.name}
      className="w-20 h-20 object-cover rounded-full border-2 border-purple-100 group-hover:border-purple-400 mb-2"
    />
    <div className="font-bold text-gray-800 text-base text-center mb-1 truncate w-32">{artist.name}</div>
    <div className="text-xs text-gray-500 mb-1">{artist.category || "Artist"}</div>
    <div className="text-xs text-purple-600 font-semibold">{artist.totalScore || 0} pts</div>
  </div>
);

const DataTable = () => {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const data = await fetchAllArtists();
        setArtists(data || []);
      } catch {
        setArtists([]);
      }
      setLoading(false);
    };
    fetchArtists();
  }, []);

  const totalPages = Math.ceil(artists.length / PAGE_SIZE);
  const paginated = artists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-16 text-lg text-gray-400">Loading artists...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {paginated.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} onClick={() => navigate(`/artist/${artist._id}`)} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 mt-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-700 font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-700 font-semibold disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
