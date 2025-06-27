import React, { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../Services/Api";

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">🏆 Global Leaderboard</h1>

      <div className="flex justify-center gap-4 mb-4">
        {["all", "monthly", "weekly"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              timeframe === tf
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.name || user.email}</td>
                  <td className="p-3 text-right">{user.totalPoints.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
