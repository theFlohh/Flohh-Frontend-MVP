import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTeamModal from "./CreateTeamModal";

const categories = ["All", "Legend", "Trending", "Breakout", "Standard"];
const sortOptions = ["A - Z", "Z - A", "Most Popular", "Newest"];

const StartingSection = ({ filter, setFilter, genres = ["All"] }) => {
  const navigate = useNavigate();
  return (
    <section className="rounded-xl p-6 w-full overflow-x-auto relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Scout top picks
          </h2>
          <p className="text-gray-300 text-xs">Draft your team linup</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 
             bg-gradient-to-r from-[#794AFE] to-[#B292FF] 
             text-white rounded-full 
             hover:from-pink-600 hover:to-purple-600 
             transition duration-300 ease-in-out"
          onClick={() => navigate("/create-team")}
        >
          Create Team
        </button>
      </div>
      <div className="flex flex-wrap gap-4 min-w-[320px]">
        <div>
          <label className="block text-gray-500 text-xs mb-1">Category</label>
          <select
            className=" border border-gray-300 text-white rounded-[30px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filter.category}
            onChange={(e) =>
              setFilter((f) => ({ ...f, category: e.target.value, genre: "All" }))
            }
          >
            {categories.map((cat) => (
              <option key={cat} className="bg-[#1F223E]">
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">Genre</label>
          <select
            className="border border-gray-300 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-[30px]"
            value={filter.genre}
            onChange={(e) =>
              setFilter((f) => ({ ...f, genre: e.target.value }))
            }
          >
            {genres.map((genre) => (
              <option key={genre} className="bg-[#1F223E]">
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">Sort by</label>
          <select
            className="border border-gray-300 text-white rounded-[30px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filter.sort}
            onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value }))}
          >
            {sortOptions.map((sort) => (
              <option key={sort} className="bg-[#1F223E]">
                {sort}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default StartingSection;
