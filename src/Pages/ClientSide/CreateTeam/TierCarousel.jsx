import React, { useRef } from "react";
import { FiPlus } from "react-icons/fi";

const TierCarousel = ({ tier, artists, selectedForTier, onSelect, locked, navigate }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="items-center">
          <h3 className="text-xl font-bold text-white flex items-center">
            {tier.label}
            {!tier.required && <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>}
            <span className="ml-3 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {selectedForTier.length}/{tier.max}
            </span>
          </h3>
          <span className="text-xs text-gray-500 hidden sm:block">
            Select {tier.required ? tier.max : `up to ${tier.max}`} artist{tier.max > 1 ? "s" : ""} from {tier.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll("left")} className="hover:bg-gray-300 hover:rounded-full">
            <img src="/img/arrow-down-01.png" alt="" />
          </button>
          <button onClick={() => scroll("right")} className="hover:bg-gray-300 hover:rounded-full">
            <img src="/img/arrow-down-01 (1).png" alt="" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className={`flex items-start rounded-lg shadow hover:shadow-lg transition p-3 relative cursor-pointer group bg-[#1f223e] h-fit w-auto min-w-max`}
            onClick={(e) => {
              if (e.target.closest("button")) return;
              navigate(`/artist/${artist._id}`);
            }}
          >
            <div className="relative group w-40 h-40 mr-4">
              <img src={artist.image || "/logoflohh.png"} alt={artist.name} className="w-40 h-40 object-cover rounded-md border border-gray-200" />
              <button
                className="absolute top-2 left-2 z-10 bg-white  cursor-pointer rounded-full p-1 shadow opacity-100 sm:opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => { e.stopPropagation(); }}
                title="Add to Favourites"
              >
                <img src="/img/heart.png" alt="fav" className="w-4 h-4" />
              </button>
              <button
                className="absolute bottom-2 right-2 z-10 cursor-pointer bg-gradient-to-r from-[#794AFE] to-[#B292FF] rounded-full p-1  shadow opacity-100 sm:opacity-0 group-hover:opacity-100 transition text-white"
                onClick={(e) => { e.stopPropagation(); onSelect(tier.value, artist); }}
                disabled={locked}
                title="Add to team"
              >
                <FiPlus className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col flex-grow gap-2 justify-between h-[150px]">
              <div className="flex flex-row justify-start min-w-[120px] gap-3 ">
                <div className="flex flex-col pr-4 border-r border-gray-400">
                  <h4 className="font-semibold text-white text-lg  flex items-center gap-1">{artist.name}</h4>
                  <div className="flex flex-col sm:flex-row items-start gap-2 ">
                    <img src="/img/game-icons_two-coins.png" alt="coin" className="w-6 h-6 object-contain" />
                    <p className="text-sm md:text-sm text-gray-400 ">{artist?.totalScore || 0}</p>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-white text-md  flex items-center gap-1">Ranking</h4>
                  <span className="text-green-400 text-xl">
                    {artist.rank && artist.previousRank ? (
                      artist.rank < artist.previousRank ? (
                        <img src="/img/auto-conversations.png" alt="Rank Up" className="w-6 h-6" />
                      ) : artist.rank > artist.previousRank ? (
                        <img src="/img/auto-conversations1.png" alt="Rank Down" className="w-6 h-6" />
                      ) : (
                        <img src="/img/auto-conversations.png" alt="Rank Same" className="w-6 h-6" />
                      )
                    ) : null}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="">
                  <h4 className="text-white text-md">Top Platforms</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="border border-gray-300 bg-[#2a2d47] rounded-full p-2">
                      <img src="img/spotify.png" alt="" className="w-6 h-6" />
                    </span>
                    <span className="border border-gray-300 bg-[#2a2d47] rounded-full p-2">
                      <img src="img/tiktok-icon.png" alt="" className="w-6 h-6" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierCarousel;


