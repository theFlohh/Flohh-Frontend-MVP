import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTeamModal from "./CreateTeamModal";

const categories = ["All", "Legend", "Trending", "Breakout", "Standard"];
const genres = ["All", "Rock", "Folk", "Rap", "Qawwali"];
const sortOptions = ["A - Z", "Z - A", "Most Popular", "Newest"];

const StartingSection = ({ filter, setFilter }) => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-50 rounded-xl p-6 mb-8 w-full overflow-x-auto relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black mb-1">Artists</h2>
          <p className="text-gray-500 text-sm">
            Discover all Artists with their profiles & stats
          </p>
        </div>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors duration-200"
          onClick={() => navigate("/create-team")}
        >
          Create Team
        </button>
      </div>
      <div className="flex flex-wrap gap-4 min-w-[320px]">
        <div>
          <label className="block text-gray-500 text-xs mb-1">Category</label>
          <select
            className="bg-gray-50 border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filter.category}
            onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">Genre</label>
          <select
            className="bg-gray-50 border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filter.genre}
            onChange={e => setFilter(f => ({ ...f, genre: e.target.value }))}
          >
            {genres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-500 text-xs mb-1">Sort by</label>
          <select
            className="bg-gray-50 border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={filter.sort}
            onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}
          >
            {sortOptions.map((sort) => (
              <option key={sort}>{sort}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default StartingSection;
