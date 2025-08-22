import React from "react";
import {
  FaUsers,       // team creation
  FaTrophy,      // leaderboard
  FaMusic,       // music/artists
  FaChartLine,   // scores
  FaEnvelope,    // support
} from "react-icons/fa";

import { FaSpotify, FaYoutube } from "react-icons/fa6"; 
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <FaUsers size={40} className="text-[#865DFF]" />,
    title: "Create Your Team",
    description:
      "Start by creating your dream team with artists from four categories: Legend, Standard, Breakout, and Trending.",
    image: "/img/team113.png",
    path: "/create-team",
  },
  {
    icon: <FaMusic size={40} className="text-[#E384FF]" />,
    title: "Explore Artist Profiles",
    description:
      "Each artist has a profile with their YouTube and Spotify links, along with top songs you can listen to directly on Spotify.",
    image: "/img/artist.png",
    path: "/artists",
  },
  {
    icon: <FaChartLine size={40} className="text-[#FFA3FD]" />,
    title: "Track Scores",
    description:
      "Artists earn Daily, Weekly, and Monthly scores. Your team points are calculated based on your selected artists.",
    image: "/img/tracks.png",
    path: "/leaderboard/global",
  },
  {
    icon: <FaTrophy size={40} className="text-[#865DFF]" />,
    title: "Compete on Leaderboards",
    description:
      "Check Global Leaderboard to see how you rank against all players or compete with friends in Friends Leaderboard.",
    image: "/img/leaderbaord.png",
    path: "/leaderboard/friend",
  },
  {
    icon: <FaEnvelope size={40} className="text-[#E384FF]" />,
    title: "Need Help?",
    description:
      "If you face any issue, reach out to our support team by sending an email with your queries.",
    image: "/img/need.png",
    path: "/support",
  },
];

const HowToPlayPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  text-white px-6 py-12 md:px-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#794AFE]">
          How to Play
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          Learn how our app works and start competing today!
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center  rounded-full">
              <div className="w-82 h-82 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-auto h-auto object-cover border-2 border-blue-500 rounded-full p-2"
                />
              </div>
            </div>

            {/* Text */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {step.icon}
                <h2 className="text-2xl md:text-3xl font-semibold">
                  {step.title}
                </h2>
              </div>
              <p className="text-gray-300 text-lg">{step.description}</p>

              {/* Button */}
              <button
                onClick={() => navigate(step.path)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#794AFE] to-[#B292FF] text-white font-semibold 
                rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 text-white font-semibold"
              >
                Go to {step.title}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-400 text-md">
          Ready to start? Build your dream team and climb the leaderboard!
        </p>
      </div>
    </div>
  );
};

export default HowToPlayPage;
