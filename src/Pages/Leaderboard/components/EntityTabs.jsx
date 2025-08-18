import React from "react";

const EntityTabs = ({ entity, onChange }) => {
  const tabs = [
    { key: "users", label: "Users" },
    { key: "artists", label: "Artists" },
  ];

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="inline-flex bg-[#1e294a] rounded-full p-1 gap-1 whitespace-nowrap w-max">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              entity === t.key
                ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md"
                : "text-white opacity-60 hover:opacity-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EntityTabs;


