import React from "react";

const TimeframeFilter = ({ timeframe, onChange }) => {
  const options = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  return (
    <div className="w-full sm:w-auto min-w-0 overflow-x-auto">
      <div className="inline-flex bg-[#1e294a] rounded-full p-1 gap-1 whitespace-nowrap w-max">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              timeframe === opt.key
                ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md"
                : "text-white opacity-60 hover:opacity-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeFilter;


