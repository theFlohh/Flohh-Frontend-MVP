// AdminAllUsersPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import Modal from "../../Components/AllUser/Modal";
import { fetchAllUsers } from "../../Services/Api";

const ITEMS_PER_PAGE = 10;

const AdminAllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    loadUsers();
  }, []);

  const getTotalScore = (user) => {
    return user?.draftedTeam?.teamMembers?.reduce(
      (sum, m) => sum + (m.artistId?.totalScore || 0),
      0
    );
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aScore = getTotalScore(a);
        const bScore = getTotalScore(b);
        return sortOrder === "asc" ? aScore - bScore : bScore - aScore;
      });
  }, [users, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-[#131634] rounded-xl shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        All Users
      </h1>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <input
          type="text"
          placeholder="Search user..."
          className="px-4 py-2 rounded-full bg-[#1e294a] text-white placeholder-gray-400 border border-transparent focus:border-purple-500 outline-none w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={handleSortToggle}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold hover:opacity-90 transition-all"
        >
          Sort by Total Score ({sortOrder.toUpperCase()})
        </button>
      </div>

      {/* Leaderboard-style Users */}
      <div className="space-y-3">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user, index) => (
            <div
              key={user._id}
              className="bg-[#1e294a] rounded-full flex flex-col sm:flex-row items-center justify-between px-6 py-4 shadow-md transition-colors hover:bg-[#27345d]"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-semibold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </div>

                {/* User Image or Icon */}
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border border-gray-500">
                    <FiUser className="text-white text-lg" />
                  </div>
                )}

                {/* Divider */}
                <div className="hidden sm:block w-[1px] h-10 bg-white opacity-30" />

                {/* User Info */}
                <div>
                  <h2 className="text-white font-semibold">{user.name}</h2>
                  <p className="text-gray-400 text-sm">
                    Team ID: {user.draftedTeam?.userTeam?._id || "-"} | Logins:{" "}
                    {user.loginCount || 0}
                  </p>
                </div>
              </div>

              {/* Score & View */}
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-blue-400 font-semibold">
                  {getTotalScore(user) || 0}
                </span>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-green-500 hover:text-indigo-300 text-lg"
                  title="View Details"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 font-medium">
            No users found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, pageIndex) => {
            const pageNum = pageIndex + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white"
                    : "bg-[#1e294a] text-gray-300 hover:bg-[#27345d]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedUser && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
    <div className="relative bg-[#191825] rounded-2xl shadow-2xl w-full max-w-4xl p-8 sm:p-10 overflow-y-auto max-h-[90vh] transition-all duration-300 text-white border border-white/10 scrollbar-hide">
      
      {/* Close Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-[#E384FF] text-2xl transition duration-200"
        aria-label="Close"
      >
        ✕
      </button>

      {/* User Header */}
      <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-5">
        {selectedUser.image ? (
          <img
            src={selectedUser.image}
            alt={selectedUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#865DFF]"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl border-4 border-[#865DFF]">
            👤
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold text-[#E384FF]">{selectedUser.name}</h2>
          <p className="text-gray-400 mt-1">
            Team ID: {selectedUser.draftedTeam?.userTeam?._id || "-"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        <StatBox label="Login Count" value={selectedUser.loginCount} />
        <StatBox label="Total Score" value={getTotalScore(selectedUser) || 0} />
        <StatBox label="Total Artists" value={selectedUser.draftedTeam?.teamMembers?.length || 0} />
      </div>

      {/* Artists List */}
      <div className="bg-[#1f1b2e] p-5 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4 text-[#FFA3FD]">
          Artists
        </h3>
        {selectedUser.draftedTeam?.teamMembers?.length > 0 ? (
          <div className="space-y-3">
            {selectedUser.draftedTeam.teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-[#2a2340] p-3 rounded-xl flex items-center justify-between hover:bg-[#322a4d] transition"
              >
                {/* Artist Info */}
                <div className="flex items-center gap-4">
                  {member.artistId?.image ? (
                    <img
                      src={member.artistId.image}
                      alt={member.artistId.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#865DFF]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-lg border-2 border-[#865DFF]">
                      🎤
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {member.artistId?.name || "Unknown"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {member.category || "-"}
                    </p>
                  </div>
                </div>

                {/* Artist Score */}
                <div className="text-[#E384FF] font-semibold text-lg">
                  {member.artistId?.totalScore || 0}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No artists assigned.</p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};
const StatBox = ({ label, value }) => (
  <div className="bg-[#27345d] rounded-xl p-4 shadow-md hover:shadow-lg transition flex flex-col items-center justify-center text-center min-h-[110px] border border-white/5">
    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
      {label}
    </div>
    <div className="text-lg font-semibold text-white">{value ?? "N/A"}</div>
  </div>
);
export default AdminAllUsersPage;
