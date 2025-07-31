import React from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";

const ArtistProfileLeft = ({ artist }) => {
  const navigate = useNavigate();

  const topSongs = [
    "Dil Niri Na Sune",
    "Main Rang Sharbaton Ka",
    "Piya O Re Piya",
    "Tu Jaane Na",
    "Haan Tha Pyar",
  ];

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        barHeight: "60%",
          columnWidth: "35%", // Reduced bar width

      },
    },
    xaxis: {
      categories: ["This Week", "Week 2", "Week 1"],
      labels: {
        style: {
          colors: ["#fff"],
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#fff"],
          fontSize: "12px",
        },
      },
    },
    grid: {
      show: false,
    },
    colors: ["#805AD5"],
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontSize: "12px",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#B794F4"],
        stops: [0, 100],
      },
    },
  };

  const chartSeries = [
    {
      data: [100, 150, 155],
    },
  ];

  return (
    <div className="bg-[#1F223E] rounded-2xl w-full max-w-xs flex flex-col items-center mx-auto md:mx-0 shadow-lg overflow-hidden px-4 pt-6 pb-4">
      {/* Profile Image + Badge */}
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

      {/* Name and Type */}
      <h2 className="text-3xl font-semibold text-white flex items-center gap-2 -mt-2">
        {artist?.name || "Artist Name"}
      </h2>
      <div className="text-sm text-white opacity-70 mb-3">
        {artist?.type || "Pakistani Playback Singer"}
      </div>

      {/* Scout Button */}
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 transition"
      >
        Scout This Artist
      </button>

      {/* Trending Score */}
      <div className="w-full text-left mb-3">
        <div className="text-lg text-white font-semibold my-3">
          TRENDING SCORE
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg w-full border border-[#353751] bg-[#2a2d48]">
          <span className="text-lg">
            <img
              src="/img/noto_fire (1).png"
              alt="fire"
              className="w-10 h-10"
            />
          </span>
          <span className="text-lg font-semibold text-white">
            Popularity Score #
            <span className="text-white font-semibold ml-1">
              {artist?.monthlyTotal ? artist.monthlyTotal : "No score"}
            </span>
            <div className="text-[10px] text-purple-400 mt-1">
              Trending in ArtistView
            </div>
          </span>
        </div>
      </div>

      {/* Top Songs (Static) */}
      <div className="w-full mb-4 border-b border-white pb-8">
        <div className="text-xl text-white font-semibold my-4">
          TOP SONGS
        </div>
        <ul>
          {topSongs.map((song, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between text-white text-lg font-medium px-3 cursor-pointer transition"
            >
              <span className="truncate">{`${idx + 1} ${song}`}</span>
              <span className="text-gray-400">{">"}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weekly Stats */}
      <div className="w-full">
        <div className="text-xs text-white font-bold mb-3 tracking-wide">WEEKLY STATS</div>
        <div className="w-full h-[180px]">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileLeft;
