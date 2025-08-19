import React from "react";
import { useNavigate } from "react-router-dom";
import ArtistCard from "./ArtistCard";

const TierSection = ({ tier, selected, artists, handleSelect, locked }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white flex items-center">
          {tier.label}
          {!tier.required && (
            <span className="text-sm text-gray-500 font-normal ml-2">
              (Optional)
            </span>
          )}
          <span className="ml-3 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {selected.length}/{tier.max}
          </span>
        </h3>
        <span className="text-xs text-gray-500">
          Select {tier.required ? tier.max : `up to ${tier.max}`} artist
          {tier.max > 1 ? "s" : ""} from {tier.label}
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {artists.map((artist) => (
          <ArtistCard
            key={artist._id}
            artist={artist}
            tier={tier}
            selected={selected}
            handleSelect={handleSelect}
            locked={locked}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

export default TierSection;
