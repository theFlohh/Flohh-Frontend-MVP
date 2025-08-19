import React from "react";

const SearchBar = ({ value, onChange, placeholder = "Search" }) => {
  return (
    <div className="relative w-full sm:w-64 min-w-0">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-3 py-2 rounded-full bg-[#1e294a] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-sm sm:text-base"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.28 11.94l4.02 4.02a.75.75 0 1 0 1.06-1.06l-4.02-4.02A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
        </svg>
      </span>
    </div>
  );
};

export default SearchBar;


