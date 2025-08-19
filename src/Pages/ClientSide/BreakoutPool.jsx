import React, { useEffect, useState } from "react";
import { fetchDraftableArtists } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const breakoutImages = [
  "/img/b1.png",
  "/img/b2.png",
  "/img/b3.png",
  "/img/b4.png",
];

const pageSize = 9;

const BreakoutPool = () => {
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtists = async () => {
      const data = await fetchDraftableArtists("Breakout");
      setArtists(data);
      setLoading(false);
    };
    getArtists();
  }, []);

  const filtered = artists.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4 min-h-screen">
        <button
  className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1F223E] font-semibold shadow transition"
  onClick={() => navigate(-1)}
>
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
  Back
</button>
      <h2 className="text-2xl font-bold text-white mb-4">Breakout Artists Pool</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search artist..."
          className="px-4 py-2 rounded-full w-full sm:w-80 bg-[#1F223E] text-white border border-purple-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginated.length === 0 ? (
            <div className="text-white text-center col-span-full">No artists found.</div>
          ) : (
            paginated.map((artist, idx) => (
              <div
                key={artist._id || artist.id}
                className="rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center relative cursor-pointer bg-[#1F223E] border border-purple-700/30 p-4"
                onClick={() => navigate(`/artist/${artist._id || artist.id}`)}
              >
                {artist.legendary && (
                  <span className="absolute top-2 left-2 bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Legendary
                  </span>
                )}
                <img
                  src={artist.image || "/logoflohh.png"}
                  alt={artist.name}
                  className="w-32 h-32 object-cover rounded-full mb-3 border-2 border-purple-500"
                />
                <h3 className="font-semibold text-white text-base mb-1 text-center">
                  {artist.name}
                </h3>
                <p className="text-xs text-purple-300 text-center mb-2">
                  {artist.bio || "Breakout Artist"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      <div className="flex justify-center items-center flex-wrap gap-3 mt-10">
  {/* Previous Button */}
  <button
    className={`px-4 py-2 rounded-full font-semibold transition-all border 
      ${page === 1
        ? "bg-gray-500/30 text-gray-300 cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700 border-purple-700"}`}
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>

  {/* Page Indicators (Optional if you want numbered pages) */}
  {Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => i + 1).map(
    (pgNum) => (
      <button
        key={pgNum}
        onClick={() => setPage(pgNum)}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
          ${page === pgNum
            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md"
            : "bg-[#1F223E] text-purple-300 border border-purple-700/30 hover:bg-purple-700 hover:text-white"}`}
      >
        {pgNum}
      </button>
    )
  )}

  {/* Next Button */}
  <button
    className={`px-4 py-2 rounded-full font-semibold transition-all border 
      ${page * pageSize >= filtered.length
        ? "bg-gray-500/30 text-gray-300 cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700 border-purple-700"}`}
    disabled={page * pageSize >= filtered.length}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
    </div>
  );
};

export default BreakoutPool;