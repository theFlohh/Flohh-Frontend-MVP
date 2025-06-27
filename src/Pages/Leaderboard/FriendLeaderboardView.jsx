import React, { useEffect, useState } from "react";
import { getFriendLeaderboardById, joinFriendLeaderboard } from "../../Services/Api";
import { useParams } from "react-router-dom";

const FriendLeaderboardView = () => {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getFriendLeaderboardById(id);
        setLeaderboard(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  const handleJoin = async () => {
    try {
      await joinFriendLeaderboard(id);
      setJoined(true);
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading leaderboard...</div>;
  if (!leaderboard) return <div className="p-6 text-red-600">Leaderboard not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{leaderboard.name} 🏆</h2>

      {!joined && (
        <button
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleJoin}
        >
          Join Leaderboard
        </button>
      )}

      <ul className="space-y-3">
        {leaderboard.leaderboard.map((user, index) => (
          <li
            key={user._id}
            className="bg-white p-4 shadow rounded flex justify-between items-center"
          >
            <span className="font-medium">
              #{index + 1} {user.name || user.username || "User"}
            </span>
            <span className="font-bold text-purple-700">{user.totalPoints.toLocaleString()} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendLeaderboardView;
