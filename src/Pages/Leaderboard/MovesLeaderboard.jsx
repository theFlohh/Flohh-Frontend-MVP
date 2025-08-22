import React, { useEffect, useState } from "react";
import { fetchUserMovesLeaderboard } from "../../Services/Api";
import Loader from "../../Components/Loader";

const MovesLeaderboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "users") {
      const getMoves = async () => {
        setLoading(true);
        try {
          const data = await fetchUserMovesLeaderboard();
          setMoves(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch moves leaderboard:", err);
        } finally {
          setLoading(false);
        }
      };
      getMoves();
    }
  }, [activeTab]);

  return (
    <div className="w-full p-4 sm:p-6 bg-[#121e3f] rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white text-center">
        Moves Leaderboard
      </h2>

      {/* Sub Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["users", "artists"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md"
                : "bg-[#1e294a] text-white opacity-70 hover:opacity-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "artists" && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
          <p className="text-gray-400 max-w-sm">
            Artist moves leaderboard will be available soon. Stay tuned for
            exciting updates!
          </p>
        </div>
      )}

      {activeTab === "users" && (
        <>
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader />
            </div>
          ) : moves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-white">
              <p className="text-lg font-semibold mb-1">
                No moves recorded yet!
              </p>
              <p className="text-gray-400 max-w-sm">
                Keep playing and scoring points to see your ranking here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-600">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Current Score</th>
                    <th className="px-4 py-2">Previous Score</th>
                    <th className="px-4 py-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#1e294a] transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-white font-semibold">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={user.image || "/img/default-avatar.png"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gradient-to-r from-purple-500 to-pink-400"
                        />
                        <span className="text-white font-medium">
                          {user.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#E384FF] font-semibold">
                        {user.currentScore}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {user.previousScore}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        {user.changeDirection === "up" && (
                          <img
                            src="/img/auto-conversations.png"
                            alt="up"
                            className="w-5 h-5"
                          />
                        )}
                        {user.changeDirection === "down" && (
                          <img
                            src="/img/auto-conversations1.png"
                            alt="down"
                            className="w-5 h-5"
                          />
                        )}
                        <span
                          className={`font-semibold ${
                            user.changeDirection === "up"
                              ? "text-green-400"
                              : user.changeDirection === "down"
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {user.changeValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovesLeaderboard;
