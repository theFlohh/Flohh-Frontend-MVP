import React, { useEffect, useState } from "react";
import { fetchDraftableArtists } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const BreakOut = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchDraftableArtists("Breakout");
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
            Breakout Artists <span role="img" aria-label="star">🌟</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover all Artists with their profiles & stats
          </p>
        </div>
        <a href="#" className="text-blue-600 hover:underline font-medium text-sm">View all</a>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {artists.length === 0 ? (
          <div className="text-gray-400 text-center w-full">No breakout artists found.</div>
        ) : (
          artists.map((artist) => (
            <div
              key={artist._id || artist.id}
              className="min-w-[170px] flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/artist/${artist._id || artist.id}`)}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-blue-200 mb-3 flex items-center justify-center bg-white">
                <img
                  src={artist.img || artist.image || "https://randomuser.me/api/portraits/men/38.jpg"}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-0.5 text-center">{artist.name}</h3>
              <p className="text-xs text-gray-500 text-center mb-2">{artist.type || artist.category || artist.tier}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BreakOut;
