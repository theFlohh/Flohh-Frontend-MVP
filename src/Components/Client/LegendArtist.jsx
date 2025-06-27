import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDraftableArtists } from "../../Services/Api";

const LegendArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchDraftableArtists("Legend");
        setArtists(data);
      } catch (err) {
        setError("Failed to load artists");
      } finally {
        setLoading(false);
      }
    };
    getArtists();
  }, []);

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
            Legend Artists <span role="img" aria-label="medal">💎</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover all Artists with their profiles & stats
          </p>
        </div>
        <a href="#" className="text-blue-600 hover:underline font-medium text-sm">View all</a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {artists.length === 0 ? (
          <div className="text-gray-400 text-center w-full">No legend artists found.</div>
        ) : (
          artists.map((artist) => (
            <div
              key={artist._id || artist.id}
              className="min-w-[180px] bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center relative cursor-pointer"
              onClick={() => navigate(`/artist/${artist._id || artist.id}`)}
            >
              {artist.legendary && (
                <span className="absolute top-2 left-2 bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">Legendary</span>
              )}
              <img
                src={artist.img || artist.image || "https://randomuser.me/api/portraits/men/44.jpg"}
                alt={artist.name}
                className="w-24 h-24 object-cover rounded-md mb-3 border border-gray-200"
              />
              <h3 className="font-semibold text-gray-800 text-lg mb-1 text-center">{artist.name}</h3>
              <p className="text-xs text-gray-500 text-center mb-2">
                {artist.bio || "Discover all Artists with their profiles & stats"}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LegendArtist;
