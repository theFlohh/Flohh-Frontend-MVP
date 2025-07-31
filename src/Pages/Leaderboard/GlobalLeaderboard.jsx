import React, { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../Services/Api";
import Loader from "../../Components/Loader";

const rankIcons = [
  "/img/gold.png", // 🥇
  "/img/sliver.png", // 🥈
  "/img/brozne.png", // 🥉
];

const GlobalLeaderboard = () => {
  const [timeframe, setTimeframe] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchGlobalLeaderboard(timeframe);
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    getLeaderboard();
  }, [timeframe]);

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6 text-white">Global Leaderboard</h1>

      <div className="flex gap-4 mb-6">
        {["all", "monthly", "weekly"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              timeframe === tf
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader />
        </div>
      ) : (
        <div className="space-y-4 bg-[#121e3f] p-6 rounded-lg shadow-lg">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="bg-[#1e294a] rounded-full flex items-center justify-between px-6 py-4 shadow-md transition-colors hover:bg-[#27345d]"
            >
              {/* Rank + User Section */}
              <div className="flex items-center gap-4">
                {/* Rank Icon or Number */}
                <div className="flex flex-col items-center">
                  {index < 3 ? (
                    <img
                      src={rankIcons[index]}
                      alt={`Rank ${index + 1}`}
                      className="w-8 h-8"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                  )}

                  {/* One Bar Text Below Rank */}
                  {/* <span className="text-[10px] text-white mt-1">1 Bar</span> */}
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-10 bg-white opacity-30" />

                {/* User Info */}
                <div>
                  <h2 className="text-white font-semibold">
                    {user.name || user.email}
                  </h2>
                </div>
              </div>
                  <p className="text-sm text-gray-400">Classical Artist</p>

              {/* Points Section */}
              <div className="flex items-center gap-2">
                <img
                  src="/img/game-icons_two-coins.png"
                  alt="coin"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-yellow-300 font-semibold">
                  {user.totalPoints.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
