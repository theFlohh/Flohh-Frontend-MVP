import React, { useEffect, useState } from "react";
import {
  createFriendLeaderboard,
  getMyFriendLeaderboards,
  fetchAllUsers,
} from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

const rankIcons = [
  "/img/gold.png",
  "/img/sliver.png",
  "/img/brozne.png",
];

const FriendsList =() => {
  const [leaderboards, setLeaderboards] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState(null);
  const [memberNames, setMemberNames] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const boards = await getMyFriendLeaderboards();
      setLeaderboards(boards);
      const users = await fetchAllUsers();
      setAllUsers(users);
      setLoading(false);
    };

    fetchData();
  }, []);

  const openLeaderboardModal = async (lb) => {
    setSelectedLeaderboard(lb);
    setModalOpen(true);
    setModalLoading(true);

    try {
      const names = lb.members.map((id) => {
        const user = allUsers.find((u) => u._id === id);
        return user ? user.name : "Unknown User";
      });

      setMemberNames(names);
    } catch (error) {
      console.error("Error fetching member names", error);
      setMemberNames(["Failed to fetch members."]);
    }

    setModalLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLeaderboard(null);
    setMemberNames([]);
  };

  const filteredLeaderboards = leaderboards.filter((lb) =>
    lb.name.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <div className="w-full p-4 sm:p-6 bg-[#121e3f] rounded-lg shadow-lg relative">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Friends Leaderboard</h2>

      {/* Input & Button */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full">
        <div className="flex items-center bg-[#1f2a4c] rounded-full px-4 py-2 w-full">
          <img src="/img/search-01.png" alt="search" className="w-4 h-4 mr-2 opacity-70" />
          <input
            type="text"
            placeholder="Leaderboard Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
          />
        </div>
        <button
          onClick={() => navigate("/leaderboard/friends/create")}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
        >
          Create New Leaderboard
        </button>
      </div>

      {/* Loader or List */}
      {loading ? (
        <Loader />
      ) : filteredLeaderboards.length === 0 ? (
        <p className="text-gray-400">No matching leaderboards found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredLeaderboards.map((lb, index) => (
            <li
              key={lb._id}
              onClick={() => openLeaderboardModal(lb)}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1e294a] rounded-full px-4 py-4 text-white shadow-md cursor-pointer hover:bg-[#2a365c] transition-colors"
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                {index < 3 ? (
                  <img src={rankIcons[index]} alt={`Rank ${index + 1}`} className="w-10 h-10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#343c58] flex items-center justify-center font-semibold text-white">
                    {index + 1}
                  </div>
                )}
                <img src="/img/flag.png" alt="flag" className="w-8 h-8 rounded-md object-cover" />
                <span className="font-semibold text-white text-base sm:text-lg">{lb.name}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 text-yellow-300 font-semibold">
                  <img src="/img/game-icons_two-coins.png" alt="coin" className="w-5 h-5 object-contain" />
                  <span className="text-sm sm:text-base">1,234,567 pts</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex justify-center items-center z-50 px-4">
          <div className="bg-[#1f2a4c] p-6 rounded-lg w-full max-w-md relative text-white">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white hover:text-red-400"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{selectedLeaderboard?.name} Members</h3>

            {modalLoading ? (
              <Loader />
            ) : (
              <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {memberNames.map((name, idx) => (
                  <li key={idx} className="bg-[#2c3a5b] px-4 py-2 rounded-md">
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
