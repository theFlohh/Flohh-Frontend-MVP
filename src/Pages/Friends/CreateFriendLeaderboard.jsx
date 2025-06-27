// import React, { useState } from 'react';
// import { createFriendLeaderboard } from '../../Services/Api';
// import { useNavigate } from 'react-router-dom';

// const CreateFriendLeaderboard = () => {
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       await createFriendLeaderboard(name);
//       setSuccess(true);
//       navigate('/leaderboard/friends'); // Redirect to friends leaderboard list
//     } catch (err) {
//       setError('Failed to create leaderboard.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
//       <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
//         <h2 className="text-xl font-bold mb-4">Create Friend Leaderboard</h2>

//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Leaderboard Name
//         </label>
//         <input
//           type="text"
//           className="w-full border rounded px-3 py-2 mb-4"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="e.g. College League"
//         />

//         {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//         {success && <div className="text-green-600 text-sm mb-2">Leaderboard created!</div>}

//         <button
//           disabled={loading || !name}
//           onClick={handleSubmit}
//           className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition"
//         >
//           {loading ? 'Creating...' : 'Create'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateFriendLeaderboard;


import React, { useEffect, useState } from 'react';
import { createFriendLeaderboard, fetchAllUsers } from '../../Services/Api';
import { useNavigate } from 'react-router-dom';

const CreateFriendLeaderboard = () => {
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        setUsers(userList);
      } catch (err) {
        setError("Failed to load users");
      }
    };
    loadUsers();
  }, []);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    setCreating(true);
    setError(null);
    try {
      await createFriendLeaderboard(name, selectedUsers);
      navigate('/leaderboard/friends');
    } catch (err) {
      setError('Failed to create leaderboard');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl w-full">
        <h2 className="text-xl font-bold mb-4">Create Friend Leaderboard</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Leaderboard Name
        </label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weekend Rivals"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Friends
        </label>
        <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
          {users.length === 0 && <p className="text-gray-500">No users found.</p>}
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                />
                <span>{user.name}</span>
              </label>
              <span className="text-xs text-gray-400">{user.totalPoints} pts</span>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <button
          disabled={creating || !name}
          onClick={handleSubmit}
          className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition"
        >
          {creating ? 'Creating...' : 'Create Leaderboard'}
        </button>
      </div>
    </div>
  );
};

export default CreateFriendLeaderboard;
