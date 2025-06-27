import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDraftableArtists } from "../../Services/Api";

const sortArtists = (artists, sort) => {
  if (sort === "A - Z") return [...artists].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "Z - A") return [...artists].sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "Most Popular") return [...artists].sort((a, b) => (b.points || 0) - (a.points || 0));
  if (sort === "Newest") return [...artists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return artists;
};

const StandardArtist = ({ filter }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchDraftableArtists("Standard");
        setArtists(data);
      } catch (err) {
        setError("Failed to load artists");
      } finally {
        setLoading(false);
      }
    };
    getArtists();
  }, []);

  // Filtering
  let filtered = artists;
  if (filter.genre && filter.genre !== "All") {
    filtered = filtered.filter(a => (a.genres || []).includes(filter.genre));
  }
  // Sorting
  filtered = sortArtists(filtered, filter.sort);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <section className="bg-gray-50 rounded-xl p-6 shadow mb-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Standard Artists <span role="img" aria-label="star">⭐</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover all Standard Artists with their profiles & stats
          </p>
        </div>
        <a href="#" className="text-blue-600 hover:underline font-medium text-sm">View all</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="text-gray-400 text-center w-full">No standard artists found.</div>
        ) : (
          filtered.map((artist) => (
            <div
              key={artist._id || artist.id}
              className="min-w-[180px] bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center relative cursor-pointer"
              onClick={() => navigate(`/artist/${artist._id || artist.id}`)}
            >
              <img
                src={artist.img || artist.image || "/logo192.png"}
                alt={artist.name}
                className="w-24 h-24 object-cover rounded-md mb-3 border border-gray-200"
              />
              <h3 className="font-semibold text-gray-800 text-lg mb-1 text-center">{artist.name}</h3>
              <p className="text-xs text-gray-500 text-center mb-2">
                {artist.bio || "Standard Artist"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default StandardArtist; 