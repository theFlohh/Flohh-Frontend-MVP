import React, { useEffect, useState } from "react";
import { fetchUserStats } from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

const ProfileIndex = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await fetchUserStats();
        setUserStats(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  if (!userStats) {
    return <div className="text-red-500 p-8">Failed to load user stats</div>;
  }
const friendRank =
    userStats.friendsRanking === "No Friends Leaderboard"
      ? 0
      : userStats.friendsRanking;
  // Select icon by comparing previous vs current weekly rank (lower rank is better)
  const hasBothRanks = Number.isFinite(userStats.weeklyCurrentRank) && Number.isFinite(userStats.weeklyPreviousRank);
  const computedChange = hasBothRanks ? (userStats.weeklyPreviousRank - userStats.weeklyCurrentRank) : null; // positive => improved
  const change = Number.isFinite(userStats.weeklyRankChange) ? userStats.weeklyRankChange : computedChange;
  const weeklyIcon = change > 0
    ? "/img/auto-conversations.png" // improved rank
    : change < 0
      ? "/img/auto-conversations1.png" // rank dropped
      : "/img/auto-conversations.png"; // no change or insufficient data

  return (
    <div className="min-h-screen bg-[#0B0C2A] text-white font-sans p-4">
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-[#6C4BF4] to-[#B56DF3] rounded-xl p-6 md:p-8 mb-6 overflow-hidden flex items-center justify-center">
        <img
          src="/img/music-notes.png"
          alt="Background Music Notes"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <h1 className="text-xl md:text-3xl font-semibold z-10 text-center">
          Welcome Back “{userStats.username}”
        </h1>
      </div>

      {/* Card Section */}
      <div className="bg-[#131634] p-4 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
          {/* Left Section - Team Points */}
          <div className="bg-[#1f223e] rounded-lg p-6 flex flex-col sm:flex-row h-fit gap-4 items-center w-full lg:w-1/2">
            <img
              src={userStats.profileImage || "https://i.ibb.co/XWyZmx0/avatar.png"}
              alt="Avatar"
              className="w-25 h-25 rounded-full border-2 border-white"
            />
            <div className="text-center sm:text-left">
              <p className="text-base md:text-lg font-medium text-gray-300">
                Team Total Points
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <img
                  src="/img/game-icons_two-coins.png"
                  alt="coin"
                  className="w-10 h-10 object-contain"
                />
                <p className="text-xl md:text-2xl text-gray-400 mt-1">
                  {userStats.teamTotalPoints.toLocaleString()} pts
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Rankings */}
          <div className="bg-[#1f223e] rounded-lg p-6 w-full lg:w-1/2 flex flex-col justify-between">
            <div className="mb-4 space-y-4">
              {/* Global Rank */}
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">Global Rank :</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-32 h-2 bg-purple-400 rounded-full">
                    <div className="absolute -right-3 -top-3 w-8 h-8 flex items-center justify-center">
                      <img
                        src="/img/star.png"
                        alt="Global Rank"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="absolute text-white text-xs font-bold">
                        {userStats.globalRanking}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Friends Rank */}
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">Friends Rank :</span>
                <div className="flex items-center gap-2">
                  <div className="relative w-32 h-2 bg-purple-400 rounded-full">
                    <div className="absolute -right-3 -top-3 w-8 h-8 flex items-center justify-center">
                      <img
                        src="/img/star.png"
                        alt="Friends Rank"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="absolute text-white text-xs font-bold">
                        {friendRank}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Moment */}
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base">Weekly Moment :</span>
                <span className="text-green-400 text-xl">
                  <img src={weeklyIcon} alt="weekly status" className="w-6 h-6" />
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                className="bg-[#6C4BF4] hover:bg-[#5b3cd0] text-white py-2 px-6 rounded-full text-sm font-semibold w-full sm:w-auto text-center"
                onClick={() => navigate("/leaderboard/global")}
              >
                View Leaderboard
              </button>
              <button
                className="bg-[#C6B7F7] hover:bg-[#b6a6ee] text-[#1E1F3B] py-2 px-6 rounded-full text-sm font-semibold w-full sm:w-auto text-center"
                onClick={() => navigate("/create-team")}
              >
                Redraft Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileIndex;
