import React, { useEffect, useState } from "react";
import { createFriendLeaderboard, getMyFriendLeaderboards } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const [leaderboards, setLeaderboards] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBoards = async () => {
    setLoading(true);
    const boards = await getMyFriendLeaderboards();
    setLeaderboards(boards);
    setLoading(false);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreate = async () => {
    if (!name) return;
    await createFriendLeaderboard(name, []);
    setName("");
    fetchBoards();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👥 My Friend Leaderboards</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-lg"
          placeholder="Leaderboard name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <button
          onClick={handleCreate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Create
        </button> */}
        <button
  onClick={() => navigate('/leaderboard/friends/create')}
  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
>
  + Create New Leaderboard
</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : leaderboards.length === 0 ? (
        <p>No friend leaderboards created yet.</p>
      ) : (
        <ul className="space-y-3">
          {leaderboards.map((lb) => (
            <li
              key={lb._id}
              className="p-4 bg-white shadow rounded cursor-pointer hover:bg-purple-50"
              onClick={() => navigate(`/leaderboard/friend/${lb._id}`)}
            >
              <span className="font-semibold">{lb.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
