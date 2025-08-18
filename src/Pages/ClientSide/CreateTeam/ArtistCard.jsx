import React from "react";

const ArtistCard = ({ artist, tier, selected, handleSelect, locked, navigate }) => {
  return (
    <div
      className={`min-w-[160px] rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center relative cursor-pointer group bg-[#1f223e] h-fit ${locked ? "opacity-60 pointer-events-none" : ""}`}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        navigate(`/artist/${artist._id}`);
      }}
    >
      <button
        className="absolute top-2 left-2 z-10 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Favourite clicked");
        }}
        title="Add to Favourites"
      >
        <img src="/img/heart.png" alt="fav" className="w-4 h-4" />
      </button>

      <img
        src={artist.image || "/logoflohh.png"}
        alt={artist.name}
        className="w-36 h-36 object-cover rounded-md mb-2 border border-gray-200"
      />
      <div className="flex w-full items-center justify-between ">
        <div className="text-left">
          <h4 className="font-semibold text-white text-base mb-1">
            {artist.name}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            {artist.type || tier.label} Artist
          </p>
        </div>
        <button
          className="ml-1"
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(tier.value, artist);
          }}
          disabled={
            locked ||
            selected.length >= tier.max ||
            selected.some((a) => a._id === artist._id)
          }
          title="Add to team"
        >
          <img src="/img/add-circle.png" alt="add" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
