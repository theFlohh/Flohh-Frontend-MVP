import React, { useEffect, useState, useMemo } from "react";
import { fetchAllArtists } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 12;

const DataTable = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchAllArtists();
        setArtists(res || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // search filter
  const filtered = useMemo(() => {
    if (!query.trim()) return artists;
    const q = query.toLowerCase();
    return artists.filter((a) => (a.name || "").toLowerCase().includes(q));
  }, [artists, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 pr-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Artists</h1>
        <input
          className="px-3 py-2 rounded-full bg-[#1C2752] border border-white/10 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search artists..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Cards Grid */}
      <div className="bg-[#131d3e] rounded-2xl border border-white/10 p-4">
        {current.length === 0 ? (
          <div className="px-4 py-6 text-purple-200/80 text-sm">
            No artists found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {current.map((a) => (
              <div
                key={a._id}
                className="rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-[#111536] hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={a.image || "/logoflohh.png"}
                    alt={a.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-sm font-semibold truncate">
                      {a.name}
                    </div>
                    <div className="text-[11px] text-purple-200/80 truncate">
                      {(a.genres || []).slice(0, 2).join(", ")}
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-200 border border-purple-500/30">
                      {a.totalScore || 0} pts
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/artist/${a._id}`)}
                    className="text-[11px] sm:text-xs px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            page === 1
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-[#865DFF] to-[#E384FF] text-white hover:opacity-90"
          }`}
        >
          Prev
        </button>
        <span className="text-white text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            page === totalPages
              ? "bg-gray-600 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-[#865DFF] to-[#E384FF] text-white hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
