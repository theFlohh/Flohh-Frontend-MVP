import React, { useEffect, useMemo, useState } from 'react';
import { createFriendLeaderboard, fetchAllUsers } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoArrowBack } from 'react-icons/io5'; // ✅ Back icon
import FriendTeamModal from './FriendTeamModal';

const CreateFriendLeaderboard = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        const roleFiltered = userList.filter((u) => u.role === 'user');
        setUsers(roleFiltered);
        setFilteredUsers(roleFiltered);
      } catch {
        setMessage({ type: 'error', text: 'Failed to load users' });
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((u) => {
        const name = (u.name || '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return name.includes(term) || username.includes(term) || email.includes(term);
      });
      setFilteredUsers(filtered);
    }
    setPage(1);
  }, [searchTerm, users]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const openUserModal = (user) => {
    setModalUser(user);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a leaderboard name.' });
      return;
    }

    if (selectedUsers.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one friend.' });
      return;
    }

    setCreating(true);

    try {
      await createFriendLeaderboard(name, selectedUsers);
      setMessage({ type: 'success', text: 'Leaderboard created successfully!' });
      setName('');
      setSelectedUsers([]);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      setMessage({ type: 'error', text: 'Failed to create leaderboard' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader />;

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    swipeToSlide: true,
    draggable: true,
    swipe: true,
    touchMove: true,
    accessibility: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0B0C2A] text-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#6C4BF4] to-[#B56DF3] rounded-b-2xl p-6 md:p-8 mb-6 overflow-hidden">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-white hover:text-purple-200 transition text-xl mr-3">
            <IoArrowBack />
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold">Create Friends Leaderboard</h2>
        </div>
        <p className="mt-2 text-purple-100 text-xs sm:text-sm">Pick friends and build a private leaderboard. Matches the global theme.</p>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Name + Selected Summary */}
        <div className="bg-[#131d3e] rounded-2xl p-5 shadow-lg border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs text-purple-200/80 mb-2">Leaderboard Name</label>
              <input
                type="text"
                placeholder="Enter leaderboard name"
                className="w-full md:w-[420px] p-3 rounded-full bg-[#1C2752] border border-white/10 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm bg-purple-600/20 text-purple-200 px-3 py-1 rounded-full border border-purple-500/30">{filteredUsers.length} Friends</span>
              <span className="text-xs sm:text-sm bg-green-600/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">{selectedUsers.length} Selected</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#131d3e] rounded-2xl p-4 shadow-lg border border-white/10 mb-5">
          <input
            type="text"
            placeholder="Search friends by name or username..."
            className="w-full md:w-[420px] p-2.5 rounded-full bg-[#1C2752] border border-white/10 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Friends List (rows) */}
        <div className="bg-[#131d3e] rounded-2xl p-2 sm:p-3 shadow-lg border border-white/10 mb-6">
          <div className="divide-y divide-white/10">
            {filteredUsers.slice((page - 1) * pageSize, page * pageSize).map((user) => {
              const isSelected = selectedUsers.includes(user._id);
              const teamCount = user?.draftedTeam?.teamMembers?.length || 0;
              const points = user?.totalPoints ?? 0;
              return (
                <div key={user._id} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 ${isSelected ? 'bg-[#111536]/60' : ''}`}>
                  {/* Left: avatar + name */}
                  <div className="flex items-center gap-3 sm:w-1/3 min-w-0" onClick={() => toggleUser(user._id)}>
                    <img src={user.image || '/img/b3.png'} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                    <div className="min-w-0">
                      <div className="text-sm sm:text-base font-semibold truncate">{user.name}</div>
                      <div className="text-[11px] sm:text-xs text-purple-200/80 truncate">{user.username || ''}</div>
                    </div>
                  </div>
                  {/* Middle: badges */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-200 border border-purple-500/30 text-[10px] sm:text-xs">{points} pts</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] sm:text-xs">{teamCount} members</span>
                  </div>
                  {/* Right: actions */}
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                      className={`text-[11px] sm:text-xs px-3 py-1 rounded-full border ${isSelected ? 'bg-purple-600 text-white border-white/20' : 'bg-white/10 text-white border-white/20'}`}
                      onClick={(e) => { e.stopPropagation(); toggleUser(user._id); }}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                    <button
                      className="text-[11px] sm:text-xs bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-full border border-white/20"
                      onClick={(e) => { e.stopPropagation(); openUserModal(user); }}
                    >
                      View Team
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredUsers.length === 0 && (
              <div className="p-4 text-sm text-purple-200/80">No users found.</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${page === 1 ? 'bg-gray-600 cursor-not-allowed text-white' : 'bg-gradient-to-r from-[#865DFF] to-[#E384FF] text-white hover:opacity-90'}`}
          >
            Prev
          </button>
          <span className="text-white text-sm font-medium">Page {page} of {Math.max(1, Math.ceil(filteredUsers.length / pageSize))}</span>
          <button
            onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil(filteredUsers.length / pageSize)), p + 1))}
            disabled={page >= Math.ceil(filteredUsers.length / pageSize)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${page >= Math.ceil(filteredUsers.length / pageSize) ? 'bg-gray-600 cursor-not-allowed text-white' : 'bg-gradient-to-r from-[#865DFF] to-[#E384FF] text-white hover:opacity-90'}`}
          >
            Next
          </button>
        </div>

        {/* Sticky Action */}
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="bg-gradient-to-r from-[#794AFE] to-[#B292FF] hover:opacity-90 text-white font-semibold py-3 px-6 rounded-full shadow-lg border border-white/10"
          >
            {creating ? 'Creating...' : 'Create Friend Leaderboard'}
          </button>
        </div>

        {message && (
          <div
            className={`fixed bottom-6 right-6 px-4 py-2 rounded-xl shadow-lg transition-all text-sm sm:text-base z-50 ${
              message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
      <FriendTeamModal open={modalOpen} user={modalUser} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default CreateFriendLeaderboard;
