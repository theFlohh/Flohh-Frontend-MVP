import React, { useEffect, useState } from "react";
import {
  fetchUserTeamById,
  fetchUserPointsBreakdown,
} from "../../Services/Api";
import Loader from "../../Components/Loader";
import { useNavigate, useParams } from "react-router-dom";

const UserTeam = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // States
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://floahh-backend.onrender.com/";
  // const BASE_URL = "http://localhost:3002/";

  useEffect(() => {
    const getTeam = async () => {
      try {
        const teamData = await fetchUserTeamById(userId);
        setTeam(teamData);
      } catch (err) {
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      getTeam();
    }
  }, [userId]);

  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];
  const rank = team?.teamRank || "N/A";
  const totalUserPoints = team?.totalPoints || 0;
  const weeklyPoints = team?.weeklyPoints || 0;
  const teamType = user.type || "Mix";
  const teamName = user.teamName || "";

  const teamAvatar = team?.userProfileImage?.startsWith("http")
    ? team.userProfileImage
    : team?.userProfileImage
    ? `${BASE_URL}${team.userProfileImage}`
    : user.avatar?.startsWith("http")
    ? user.avatar
    : user.avatar
    ? `${BASE_URL}${user.avatar}`
    : null;

  const getCategoryMeta = (category) => {
    switch (category) {
      case "Legend":
        return {
          icon: "/img/medal-yellow.png",
          chip: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
        };
      case "Trending":
        return {
          icon: "/img/medal-red.png",
          chip: "bg-red-500/20 text-red-200 border-red-400/30",
        };
      case "Breakout":
        return {
          icon: "/img/medal-purple.png",
          chip: "bg-purple-600/20 text-purple-200 border-purple-500/30",
        };
      case "Standard":
        return {
          icon: "/img/star.png",
          chip: "bg-blue-500/20 text-blue-200 border-blue-400/30",
        };
      default:
        return {
          icon: "/img/star.png",
          chip: "bg-white/10 text-white border-white/20",
        };
    }
  };

  // Rendering
  if (loading) return <Loader />;

  // If no team found
  if (error || !team || !team.userTeam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-md w-full">
          <div className="text-xl font-bold text-gray-200 text-center flex flex-col items-center">
            <img src="/img/team.png" alt="team" />
            This user hasn't created a team yet.
          </div>
          <button
            className="mt-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow transition text-base"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 font-sans relative">
      <div className="max-w-6xl mx-auto relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition"
        >
          ← Back
        </button>

        {/* Banner */}
        <div
          className="relative w-full h-32 sm:h-40 md:h-52 rounded-2xl mb-16 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url('/img/banner-rect1.png')` }}
        ></div>

        {/* Avatar + Team Name */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-6 sm:gap-10 -mt-13 sm:-mt-24 px-2">
          {/* Avatar */}
          <div className="relative sm:self-center sm:self-start">
            <img
              src={teamAvatar || "/img/default-avatar.png"}
              alt={teamName || "Team Avatar"}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-purple-400 object-cover shadow-lg"
            />
          </div>

          {/* Team Info */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
              {teamName || "Unnamed Team"}
            </div>
            <div className="text-sm text-yellow-400 flex items-center gap-1 mt-2">
              <img
                src="/img/game-icons_two-coins.png"
                alt="coin"
                className="w-4 h-4 object-contain"
              />
              {totalUserPoints.toLocaleString()} pts
            </div>
          </div>
        </div>

        {/* Stats + Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Left Side Stats */}
          <div className="space-y-6 order-2 md:order-1">
            {/* Rank & Weekly */}
            <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl text-gray-300">Rank</div>
                  <div className="text-xl font-bold text-yellow-300">
                    #{rank}
                  </div>
                </div>
                <div>
                  <div className="text-sm sm:text-lg text-gray-300">
                    Weekly Points
                  </div>
                  <div className="text-sm sm:text-base font-semibold flex items-center gap-1 text-yellow-400">
                    <img
                      src="/img/game-icons_two-coins.png"
                      alt="coin"
                      className="w-5 h-5 object-contain"
                    />
                    {weeklyPoints.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Info */}
            <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg space-y-3 text-sm text-white">
              <div className="flex justify-between text-sm sm:text-lg">
                <span>Total User Pts:</span>
                <span className="flex items-center gap-1">
                  <img
                    src="/img/game-icons_two-coins.png"
                    alt="coin"
                    className="w-5 h-5 object-contain"
                  />
                  {totalUserPoints >= 1000000
                    ? (totalUserPoints / 1000000).toFixed(2) + " M"
                    : totalUserPoints.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-lg">
                <span>Members:</span>
                <span>{members.length.toString().padStart(2, "0")}/07</span>
              </div>
              <div className="flex justify-between text-sm sm:text-lg">
                <span>Type:</span>
                <span>{teamType}</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="md:col-span-2 order-1 md:order-2 rounded-xl shadow-lg">
            {members.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No team members found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m, idx) => {
                  const artist = m.artistId || {};
                  return (
                    <div
                      key={artist._id || idx}
                      className="relative bg-[#1f223e] border border-[#353751] rounded-xl p-4 sm:p-5 shadow-lg hover:scale-105 transform transition cursor-pointer flex flex-col"
                      onClick={() => navigate(`/artist/${artist._id}`)}
                    >
                      {m.category &&
                        (() => {
                          const meta = getCategoryMeta(m.category);
                          return (
                            <span
                              className={`absolute top-2 right-2 flex items-center gap-1 px-0.5 py-0.5 rounded-full text-[10px] sm:text-xs border ${meta.chip}`}
                            >
                              <img
                                src={meta.icon}
                                alt={m.category}
                                className="w-6 h-6"
                              />
                            </span>
                          );
                        })()}
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full gap-2 mb-3 border-b border-gray-600 ">
                        <div className="flex flex-col justify-start min-w-0">
                          <h3 className="font-semibold text-md text-white mb-1 text-left">
                            {artist.name || "Artist Name"}
                          </h3>
                          <p className="text-yellow-400 text-sm mb-3 flex items-center gap-1">
                            <img
                              src="/img/game-icons_two-coins.png"
                              alt="coin"
                              className="w-3 h-3 object-contain"
                            />
                            {artist.totalScore?.toLocaleString() || "0"} pts
                          </p>
                        </div>
                      </div>
                      {/* Drafting Percentage */}
                      <div className="flex flex-row gap-2">
                        <div className="bg-[#2a2d48] px-4 py-2 rounded-full text-[12px] text-gray-300 mb-3">
                          Drafting : {artist?.draftingPercentage || "0"}%{" "}
                        </div>
                        <span className="bg-[#2a2d48] rounded-full px-2 py-1 text-xs mb-3">
                          {artist.rank && artist.previousRank ? (
                            artist.rank < artist.previousRank ? (
                              // Rank improved
                              <img
                                src="/img/auto-conversations.png"
                                alt="Rank Up"
                                className="w-6 h-6"
                              />
                            ) : artist.rank > artist.previousRank ? (
                              // Rank dropped
                              <img
                                src="/img/auto-conversations1.png"
                                alt="Rank Down"
                                className="w-6 h-6"
                              />
                            ) : (
                              // Rank same
                              <img
                                src="/img/auto-conversations.png"
                                alt="Rank Same"
                                className="w-6 h-6"
                              />
                            )
                          ) : null}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTeam;
