import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDraftableArtists } from "../../Services/Api";

const trendingImages = [
  "/img/l1.png",
  "/img/l2.png",
  "/img/l3.png",
  "/img/l4.png",
  "/img/l5.png",
  "/img/l6.png",
];

const sortArtists = (artists, sort) => {
  if (sort === "A - Z") return [...artists].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "Z - A") return [...artists].sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "Most Popular") return [...artists].sort((a, b) => (b.points || 0) - (a.points || 0));
  if (sort === "Newest") return [...artists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return artists;
};

const TrendingArtist = ({ filter }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchDraftableArtists("Trending");
        setArtists(data);
      } catch (err) {
        setError("Failed to load artists");
      } finally {
        setLoading(false);
      }
    };
    getArtists();
  }, []);

  let filtered = artists;
  if (filter?.genre && filter.genre !== "All") {
    const selected = String(filter.genre).toLowerCase();
    filtered = filtered.filter((a) => (a.genres || []).some((g) => String(g).toLowerCase() === selected));
  }
  filtered = sortArtists(filtered, filter?.sort);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }
  if (filter?.genre && filter.genre !== "All" && filtered.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl p-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Trending Artists{" "}
          <img
            src="/img/medal-red.png"
            alt="Legend Icon"
            className="w-5 h-5"
          />
        </h2>
        <p className="text-purple-200 text-sm mt-1">
          Discover all Artists with their profiles & stats
        </p>
      </div>
      {/* Cards */}
      <div className="flex gap-6 align-center overflow-x-auto pb-2 scrollbar-hide mt-4 justify-center">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mt-4 w-4/5">
          {filtered.map((artist, idx) => (
            <div
              key={artist._id || artist.id}
              className="min-w-[200px] rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center relative cursor-pointer"
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
                className="w-40 h-40 object-cover rounded-full mb-3 border-2 border-purple-500"
              />
              <h3 className="font-semibold text-white text-base mb-1 text-center">
                {artist.name}
              </h3>
              <p className="text-xs text-purple-300 text-center mb-2">
                {artist.bio || "Discover all Artists with their profiles & stats"}
              </p>
            </div>
          ))}
        </div>
        {/* Desktop: See Full Pool card */}
        <div className="hidden md:flex mt-2">
          <div
            className="min-w-[200px] h-[200px] flex items-center justify-center rounded-full border border-purple-700/30 bg-[#1F223E] text-white font-semibold text-lg cursor-pointer hover:bg-purple-700/10 transition"
            onClick={() => navigate("/trending-pool")}
          >
            See Full Pool
          </div>
        </div>
      </div>
      {/* Mobile: View All button */}
      <div className="flex md:hidden justify-end mt-4">
        <button
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold text-sm shadow hover:from-purple-600 hover:to-pink-500 transition"
          onClick={() => navigate("/trending-pool")}
        >
          View All
        </button>
      </div>
    </section>
  );
};

export default TrendingArtist;
