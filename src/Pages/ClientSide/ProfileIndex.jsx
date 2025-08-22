import React, { useEffect, useState } from "react";
import { fetchUserStats, getUserDetails, updateUser } from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

const ProfileIndex = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ modal state

 // useEffect me:
useEffect(() => {
  const loadData = async () => {
    try {
      const [stats, details] = await Promise.all([
        fetchUserStats(),
        getUserDetails(),
      ]);

      setUserStats(stats);
      setUserDetails(details);

      // 🔑 Always use backend URL first
      setFormData({
        name: details.name || "",
        email: details.email || "",
        password: "",
        profileImage: null,
      });

      // 🔑 Agar backend me profileImage hai to wahi set karo
      setPreviewImage(details.profileImage || "https://i.ibb.co/XWyZmx0/avatar.png");
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

// handleInputChange me:
const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "profileImage" && files.length > 0) {
    setFormData({ ...formData, profileImage: files[0] });
    // 🔑 Local preview sirf file choose karte waqt dikhana
    setPreviewImage(URL.createObjectURL(files[0]));
  } else {
    setFormData({ ...formData, [name]: value });
  }
  setIsChanged(true);
};

// handleUpdate me:
const handleUpdate = async () => {
  setUpdating(true);
  try {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    if (formData.password) fd.append("password", formData.password);
    if (formData.profileImage) fd.append("profileImage", formData.profileImage);

    const updated = await updateUser(fd);
    setUserDetails(updated.user);

    // ✅ Always prefer S3 URL returned from backend
    if (updated.user?.profileImage) {
      localStorage.setItem("profileImage", updated.user.profileImage);
      setPreviewImage(updated.user.profileImage);
    }

    setIsChanged(false);
    setShowModal(true);
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    setUpdating(false);
  }
};

  

  if (loading) return <Loader />;

  if (!userStats || !userDetails) {
    return <div className="text-red-500 p-8">Failed to load profile data</div>;
  }

  const friendRank =
    userStats.friendsRanking === "No Friends Leaderboard"
      ? 0
      : userStats.friendsRanking;

  const hasBothRanks =
    Number.isFinite(userStats.weeklyCurrentRank) &&
    Number.isFinite(userStats.weeklyPreviousRank);

  const computedChange = hasBothRanks
    ? userStats.weeklyPreviousRank - userStats.weeklyCurrentRank
    : null;

  const change = Number.isFinite(userStats.weeklyRankChange)
    ? userStats.weeklyRankChange
    : computedChange;

  const weeklyIcon =
    change > 0
      ? "/img/auto-conversations.png"
      : change < 0
      ? "/img/auto-conversations1.png"
      : "/img/auto-conversations.png";

  return (
    <div className="min-h-screen bg-[#0B0C2A] text-white font-sans p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Profile Update */}
        <div className="bg-[#131634] rounded-2xl p-8 shadow-lg flex flex-col items-center">
          <div className="relative">
            <img
              src={previewImage || "https://i.ibb.co/XWyZmx0/avatar.png"}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-[#6C4BF4] shadow-md object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold mt-5 mb-6">Update Your Profile</h2>

          <div className="w-full space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#1f223e] border border-gray-600 
                  focus:border-[#6C4BF4] focus:ring-2 focus:ring-[#6C4BF4] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#1f223e] border border-gray-600 
                  focus:border-[#6C4BF4] focus:ring-2 focus:ring-[#6C4BF4] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#1f223e] border border-gray-600 
                  focus:border-[#6C4BF4] focus:ring-2 focus:ring-[#6C4BF4] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#1f223e] border border-gray-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            disabled={!isChanged || updating}
            onClick={handleUpdate}
            className={`w-full py-3 mt-6 rounded-full font-semibold transition duration-200 shadow-md ${
              isChanged
                ? "bg-[#6C4BF4] hover:bg-[#5b3cd0] text-white"
                : "bg-gray-600 cursor-not-allowed text-gray-300"
            }`}
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </div>

        {/* Right: Stats (height only as per content ✅) */}
        <div className="bg-[#131634] rounded-2xl p-8 shadow-lg flex flex-col space-y-6 h-fit">
          <h2 className="text-xl font-semibold">Your Stats</h2>

          <div className="p-5 bg-[#1f223e] rounded-xl flex items-center justify-between">
            <p className="text-base font-medium text-gray-300">Team Total Points</p>
            <div className="flex items-center gap-2">
              <img src="/img/game-icons_two-coins.png" alt="coin" className="w-7 h-7" />
              <span className="text-xl font-bold text-gray-100">
                {userStats.teamTotalPoints.toLocaleString()} pts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1f223e] rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400">Global Rank</p>
              <p className="text-lg font-bold text-[#FFA3FD]">{userStats.globalRanking}</p>
            </div>
            <div className="bg-[#1f223e] rounded-xl p-5 text-center">
              <p className="text-sm text-gray-400">Friends Rank</p>
              <p className="text-lg font-bold text-[#FFA3FD]">{friendRank}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm text-gray-400">Weekly Moment:</span>
            <img src={weeklyIcon} alt="weekly status" className="w-7 h-7" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              className="bg-[#6C4BF4] hover:bg-[#5b3cd0] text-white py-2 px-6 rounded-full w-full sm:w-auto shadow-md"
              onClick={() => navigate("/leaderboard/global")}
            >
              View Leaderboard
            </button>
            <button
              className="bg-[#C6B7F7] hover:bg-[#b6a6ee] text-[#1E1F3B] py-2 px-6 rounded-full w-full sm:w-auto shadow-md"
              onClick={() => navigate("/create-team")}
            >
              Redraft Team
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center z-50">
          <div className="bg-[#1f223e] p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center relative">
            {/* Success Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Profile Updated</h3>
            <p className="text-gray-400 mb-4">
              Your profile has been updated successfully!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#6C4BF4] hover:bg-[#5b3cd0] text-white py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIndex;

