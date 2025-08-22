import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { FaInfoCircle } from "react-icons/fa"; // Info icon

const ArtistProfileLeft = ({ artist }) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    if (window.innerWidth <= 768) {
      setShowTooltip(!showTooltip);
    }
  };

  const chartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        barHeight: "60%",
        columnWidth: "35%",
      },
    },
    xaxis: {
      categories: ["This Week", "Week 2", "Week 1"],
      labels: { style: { colors: ["#fff"], fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: ["#fff"], fontSize: "12px" } } },
    grid: { show: false },
    colors: ["#865DFF"],
    tooltip: { theme: "dark" },
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"], fontSize: "12px" },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#E384FF"],
        stops: [0, 100],
      },
    },
  };

  const chartSeries = [{ data: [100, 150, 155] }];

  return (
    <div className="bg-[#131634] rounded-2xl w-full max-w-xs flex flex-col items-center mx-auto md:mx-0 shadow-lg  px-4 pt-6 pb-4">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={artist?.image || "/logoflohh.png"}
          alt={artist?.name || "Artist"}
          className="w-44 h-44 rounded-full object-cover mb-3 border-4 border-white shadow"
        />
        <img
          src="/img/fire.png"
          alt="Trending"
          className="absolute top-0 right-0 w-16 h-16 -mt-1 -mr-2"
        />
      </div>

      {/* Name with Description Tooltip */}
      <div className="flex items-center gap-2 -mt-2 relative">
        <h2 className="text-3xl font-semibold text-white">
          {artist?.name || "Artist Name"}
        </h2>

       {artist?.description && (
  <div
    className="relative group"
    onClick={toggleTooltip} // mobile toggle
  >
    <FaInfoCircle className="text-[#E384FF] cursor-pointer hover:text-[#FFA3FD]" />

    {/* Tooltip */}
    <div
      className={`
        absolute top-full -left-25 transform -translate-x-1/2 mt-2 
        w-65 sm:w-80 md:w-96 max-w-[90vw] 
        max-h-68 sm:max-h-60 md:max-h-72 overflow-y-auto 
        bg-[#2a2d48] text-white text-sm p-3 rounded-xl shadow-lg border border-[#865DFF]
        transition-opacity duration-300 z-20
        ${showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"}
        group-hover:opacity-100 group-hover:pointer-events-auto
        scrollbar-hide z-1000
      `}
    >
      <div
        className="space-y-2 text-md sm:text-sm md:text-base"
        dangerouslySetInnerHTML={{
          __html: artist.description
            .replace(
              /(https?:\/\/[^\s]+)/g,
              `<a href="$1" target="_blank" class="text-[#FFA3FD] underline break-words">$1</a>`
            )
            .replace(
              /\b(\d{4})\b/g,
              `<span class="text-[#E384FF] font-semibold">$1</span>`
            ),
        }}
      />
    </div>
  </div>
)}

      </div>

      <div className="text-sm text-white opacity-70 mb-3">
        {artist?.genres || "Pakistani Playback Singer"}
      </div>

      {/* Scout Button */}
      <button className="bg-[#865DFF] hover:bg-[#E384FF] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 transition">
        Scout This Artist
      </button>

      {/* Trending Score */}
      <div className="w-full text-left mb-3">
        <div className="text-lg text-white font-semibold my-3">
          TRENDING SCORE
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-full border border-[#353751] bg-[#2a2d48]">
          <img src="/img/noto_fire (1).png" alt="fire" className="w-10 h-10" />
          <span className="text-lg font-semibold text-white">
            Popularity Score #
            <span className="ml-1">{artist?.monthlyTotal || "No score"}</span>
            <div className="text-[10px] text-[#865DFF] mt-1">
              Trending in ArtistView
            </div>
          </span>
        </div>
      </div>

      {/* Top Songs */}
      <div className="w-full mb-4 border-b border-white pb-8">
        <div className="text-xl text-white font-semibold my-4">TOP SONGS</div>
        {artist?.topTracks?.length > 0 ? (
          <ul>
            {artist.topTracks.map((track, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-white text-lg font-medium px-3 cursor-pointer hover:text-[#E384FF] transition"
                onClick={() => window.open(track?.spotifyUrl, "_blank")}
              >
                <span className="truncate">{track.name}</span>
                <span className="text-gray-400">{">"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-sm px-3">
            No top songs available
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      <div className="w-full">
        <div className="text-xs text-white font-bold mb-3 tracking-wide">
          WEEKLY STATS
        </div>
        <div className="w-full h-[180px]">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileLeft;
