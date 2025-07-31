import React, { useEffect, useState } from 'react';
import { createFriendLeaderboard, fetchAllUsers } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CreateFriendLeaderboard = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState(null);
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
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((u) => {
        const name = u.name || '';
        const username = u.username || '';
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen flex justify-center p-4 sm:p-8 text-white relative">
      <div className="w-full max-w-6xl bg-[#131d3e] rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Leaderboard Name</h2>

        <input
          type="text"
          placeholder="Enter leaderboard name"
          className="w-full sm:w-1/2 mb-6 p-3 rounded-full bg-[#334155] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl sm:text-2xl font-semibold">Select Friends</h3>
          {selectedUsers.length > 0 && (
            <span className="text-sm sm:text-base bg-purple-600 text-white px-3 py-1 rounded-full">
              {selectedUsers.length} Selected
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Search friends..."
          className="w-full sm:w-1/2 mb-4 p-2 rounded-full bg-[#334155] border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Slider {...sliderSettings} className="mb-6">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.includes(user._id);

            return (
              <div key={user._id} className="px-2 relative group">
                <div
                  className={`rounded-xl overflow-hidden shadow-lg transition transform hover:scale-105 relative border-2 ${
                    isSelected ? 'border-purple-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={user.image || '/img/b3.png'}
                    alt={user.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 text-center">
                    <div className="font-semibold text-sm truncate">{user.name}</div>
                    <div className="text-xs text-purple-300">{user.username}</div>
                  </div>
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUser(user._id);
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isSelected ? 'bg-purple-500 border-white' : 'bg-white/20 border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition"
          >
            {creating ? 'Creating...' : 'Create Friend Leaderboard'}
          </button>
        </div>

        {message && (
          <div
            className={`fixed bottom-6 right-6 px-4 py-2 rounded-xl shadow-lg transition-all text-sm sm:text-base z-50 ${
              message.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFriendLeaderboard;
