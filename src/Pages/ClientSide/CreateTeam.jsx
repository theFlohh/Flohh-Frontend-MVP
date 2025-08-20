import React, { useEffect, useState } from "react";
import {
  fetchDraftableArtists,
  fetchUserTeam,
  submitDraft,
  updateDraft,
} from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import ConfirmModal from "../../Components/Client/ConfirmModal";
// import musicBanner from "../../../public/img/music.png"; // apni image ka path sahi karen

const TIERS = [
  { label: "Legends", value: "Legend", max: 1, required: true },
  { label: "Trending", value: "Trending", max: 2, required: true },
  { label: "Breakout", value: "Breakout", max: 2, required: true },
  { label: "Standard", value: "Standard", max: 2, required: false }, // Made optional
];

const CreateTeam = () => {
  const [artists, setArtists] = useState({
    Legend: [],
    Trending: [],
    Breakout: [],
    Standard: [],
  });
  const [selected, setSelected] = useState({
    Legend: [],
    Trending: [],
    Breakout: [],
    Standard: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockMsg, setLockMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [hasTeam, setHasTeam] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState("success");
  const [statusMsg, setStatusMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const legend = await fetchDraftableArtists("Legend");
      const trending = await fetchDraftableArtists("Trending");
      const breakout = await fetchDraftableArtists("Breakout");
      const standard = await fetchDraftableArtists("Standard");
      setArtists({
        Legend: legend,
        Trending: trending,
        Breakout: breakout,
        Standard: standard,
      });

      // Fetch user's existing team
      try {
        const userTeam = await fetchUserTeam();
        if (userTeam && userTeam.teamMembers) {
          setHasTeam(true);
          const prefill = {
            Legend: [],
            Trending: [],
            Breakout: [],
            Standard: [],
          };
          userTeam.teamMembers.forEach((member) => {
            if (prefill[member.category]) {
              prefill[member.category].push(member.artistId);
            }
          });
          setSelected(prefill);
        }

        // Lock logic
        if (userTeam && userTeam.userTeam) {
          console.log("user team is", typeof userTeam.userTeam.isLocked);

          const { isLocked, createdAt } = userTeam.userTeam;

          if (isLocked === true) {
            setLocked(true);
            setLockMsg(
              "You cannot change your team for 12 hours after your last update."
            );
          } else {
            // Show info message without locking if backend allows updates
            const created = new Date(createdAt);
            const now = new Date();
            const diff = (now - created) / (1000 * 60 * 60); // hours

            if (diff < 12) {
              const remainingHours = Math.ceil(12 - diff);
              setInfoMsg(
                `You can update your team now. Your lock period starts in ${remainingHours} hour(s).`
              );
            }
          }
        }
      } catch (e) {
        /* ignore if no team */
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleSelect = (tier, artist) => {
    if (locked) return;
    if (selected[tier].find((a) => a._id === artist._id)) return;
    if (selected[tier].length >= TIERS.find((t) => t.value === tier).max)
      return;
    setSelected((prev) => ({ ...prev, [tier]: [...prev[tier], artist] }));
  };

  const handleRemove = (tier, artistId) => {
    if (locked) return;
    setSelected((prev) => ({
      ...prev,
      [tier]: prev[tier].filter((a) => a._id !== artistId),
    }));
  };

  const teamIsEmpty = Object.values(selected).every((arr) => arr.length === 0);

  // Updated logic: only check required tiers for completion
  const teamIsComplete = TIERS.filter((tier) => tier.required) // Only check required tiers
    .every((tier) => selected[tier.value].length === tier.max);

  const handleSave = async () => {
    if (locked) return;
    setSaving(true);
    setError("");
    setSuccess("");
    // Validation: check all required tiers
    for (const tier of TIERS.filter((t) => t.required)) {
      if (selected[tier.value].length !== tier.max) {
        setSaving(false);
        setToast(
          `Please select ${tier.max} artist${tier.max > 1 ? "s" : ""} from ${
            tier.label
          }.`
        );
        setTimeout(() => setToast(""), 3000);
        return;
      }
    }
    try {
      // Collect all selected artist IDs
      const draftedArtists = [
        ...selected.Legend.map((a) => a._id),
        ...selected.Trending.map((a) => a._id),
        ...selected.Breakout.map((a) => a._id),
        ...selected.Standard.map((a) => a._id),
      ];

      if (hasTeam) {
        await updateDraft(draftedArtists);
        setSuccess("Team updated successfully!");
        setStatusType("success");
        setStatusMsg("Team updated successfully!");
        setShowStatusModal(true);
      } else {
        await submitDraft(draftedArtists);
        setSuccess("Team saved successfully!");
        setStatusType("success");
        setStatusMsg("Team saved successfully!");
        setShowStatusModal(true);
      }

      setTimeout(() => {
        setShowStatusModal(false);
        navigate("/my-team");
      }, 2500);
    } catch (e) {
      let msg =
        e?.response?.data?.error ||
        "Failed to save/update team. Please try again.";
      setError(msg);
      setStatusType("error");
      setStatusMsg(msg);
      setShowStatusModal(true);
      setTimeout(() => setShowStatusModal(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const DraftBanner = ({ minutes }) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const formatTime = () => {
      if (hours > 0 && remainingMinutes > 0) {
        return `${hours} hour${
          hours > 1 ? "s" : ""
        } ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      } else {
        return `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
      }
    };

    return (
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#7B4DFE] via-[#7B4DFE] to-[#B393FE] px-4 py-3 sm:px-6 sm:py-4 h-[130px] sm:h-[100px]">
          <div className="flex-1">
            <div className="text-xl sm:text-2xl text-white mb-1">
              Draft opens in {formatTime()}
            </div>
            <div className="text-purple-100 text-sm sm:text-sm">
              Only {formatTime()} stand between you and your dream team. Make
              those picks count when the draft begins.
            </div>
          </div>
          <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-6">
            <img
              src="/img/music.png"
              alt="Music Banner"
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-4 md:p-8">
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Team</h2>

        {/* Lock message (red) */}
        {locked && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4 font-semibold text-center">
            {lockMsg}
          </div>
        )}

        {/* Info message (blue) - shows without locking */}
        {!locked && infoMsg && (
          <div className="bg-blue-100 text-blue-700 rounded-lg px-4 py-3 mb-4 font-medium text-center">
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {infoMsg}
            </div>
          </div>
        )}

        {/* Dynamic Banner */}
        {locked && <DraftBanner minutes={30} />}
        {/* Info message (blue) */}
        {!locked && infoMsg && (
          <DraftBanner minutes={12 * 60} /> // Example: 12 hours left, you can make this dynamic
        )}

        {TIERS.map((tier) => (
          <div key={tier.value}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white flex items-center">
                {tier.label}
                {!tier.required && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    (Optional)
                  </span>
                )}
                {/* Indicator */}
                <span className="ml-3 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {selected[tier.value].length}/{tier.max}
                </span>
              </h3>
              <span className="text-xs text-gray-500">
                Select {tier.required ? tier.max : `up to ${tier.max}`} artist
                {tier.max > 1 ? "s" : ""} from {tier.label}
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {artists[tier.value].map((artist) => (
                <div
                  key={artist._id}
                  className={`min-w-[160px] rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center relative cursor-pointer group bg-[#1f223e] h-fit ${
                    locked ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={(e) => {
                    if (e.target.closest("button")) return;
                    navigate(`/artist/${artist._id}`);
                  }}
                >
                  {/* Favorite PNG Icon (Top-left) */}
                  <button
                    className="absolute top-2 left-2 z-10 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Favourite clicked");
                    }}
                    title="Add to Favourites"
                  >
                    <img src="/img/heart.png" alt="fav" className="w-4 h-4" />
                  </button>

                  <img
                    src={artist.image || "/logoflohh.png"}
                    alt={artist.name}
                    className="w-36 h-36 object-cover rounded-md mb-2 border border-gray-200"
                  />
                  <div className="flex w-full items-center justify-between ">
                  <div className="text-left">
                    <h4 className="font-semibold text-white text-base mb-1 flex items-center justify-between gap-1">
                      {artist.name}
                    </h4>

                    <p className="text-xs text-gray-500  mb-2 ">
                      {artist.type || tier.label} Artist
                    </p>
                  </div>

                  <button
                    className="ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(tier.value, artist);
                    }}
                    disabled={
                      locked ||
                      selected[tier.value].length >= tier.max ||
                      selected[tier.value].find((a) => a._id === artist._id)
                    }
                    title="Add to team"
                  >
                    {/* Plus PNG icon next to name */}
                    <img
                      src="/img/add-circle.png"
                      alt="add"
                      className="w-4 h-4"
                    />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Team selection panel */}
      {!teamIsEmpty && (
        <div
          className={`w-full md:w-1/3 rounded-2xl shadow-lg p-4 flex flex-col gap-4 h-fit relative ${
            locked ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {locked && (
            <div className="absolute inset-0  bg-opacity-60 z-10 rounded-2xl" />
          )}
          <h3 className="text-lg font-bold text-white mb-2">Your Team</h3>
          {TIERS.map((tier) => (
            <div key={tier.value} className="mb-2">
              <div className="text-xs text-gray-500 mb-1 flex items-center">
                {tier.label}
                {!tier.required && (
                  <span className="text-gray-400 ml-1">(Optional)</span>
                )}
                {/* Indicator */}
                <span className="ml-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {selected[tier.value].length}/{tier.max}
                </span>
              </div>
              {selected[tier.value].map((artist) => (
                <div
                  key={artist._id}
                  className={`group relative flex items-center rounded-lg overflow-hidden mb-2 transition-all duration-300 ${
                    locked ? "bg-gray-100 opacity-60" : "bg-[#1F223E]"
                  }`}
                >
                  {/* Content Section */}
                  <div className="flex items-center gap-6 p-2 flex-grow z-10">
                    <img
                      src={artist.image || "/logoflohh.png"}
                      alt={artist.name}
                      className="w-16 h-16 rounded-sm object-cover border border-gray-300"
                    />
                    <div className="flex flex-col flex-grow">
                      <div className="text-white font-semibold text-xl">
                        {artist.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {artist.type || tier.label} Artist
                      </div>
                    </div>
                  </div>

                  {/* Delete Button - Slide in from right on hover */}
                  {/* Delete Button - Slide in from right on hover */}
                  {/* Delete Button - Slide in from right on hover */}
                  <div className="absolute right-0 top-0 h-full z-20 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0">
                    <button
                      className={`h-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-5 rounded-l-lg transition-all ${
                        locked ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        !locked && handleRemove(tier.value, artist._id)
                      }
                      disabled={locked}
                      title={
                        locked
                          ? "You can edit your team after 12 hours."
                          : "Remove"
                      }
                    >
                      {/* New Trash Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-1 4v10m-4-10v10m-4-10v10m1 4h6a2 2 0 002-2V6H5v14a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={() => setShowConfirmModal(true)}
            className={`mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition ${
              !teamIsComplete || saving || locked
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!teamIsComplete || saving || locked}
          >
            {saving ? "Saving..." : "Confirm Your Final Lineup"}
          </button>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {showStatusModal && (
        <StatusModal
          type={statusType}
          message={statusMsg}
          onClose={() => setShowStatusModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          selectedArtists={[
            ...selected.Legend,
            ...selected.Trending,
            ...selected.Breakout,
            ...selected.Standard,
          ]}
          onConfirm={() => {
            setShowConfirmModal(false);
            handleSave(); // This is your original save logic
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

// Toast component for error notifications
const Toast = ({ message, onClose }) => (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414 1.414A9 9 0 1018.364 5.636z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01"
        />
      </svg>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 font-bold"
      >
        ×
      </button>
    </div>
  </div>
);

// StatusModal component for success/error
const StatusModal = ({ type, message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-all">
    <div
      className={`bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center max-w-xs w-full border-t-4 ${
        type === "success" ? "border-green-500" : "border-red-500"
      } animate-fade-in-scale`}
    >
      <div
        className={`text-3xl mb-2 ${
          type === "success" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "success" ? "✔️" : "❌"}
      </div>
      <div
        className={`text-center font-semibold text-lg mb-2 ${
          type === "success" ? "text-green-600" : "text-red-600"
        }`}
      >
        {message}
      </div>
      <button
        onClick={onClose}
        className="mt-2 px-4 py-1 bg-gray-200 hover:bg-purple-100 hover:text-purple-700 rounded text-gray-700 font-medium text-sm transition cursor-pointer"
      >
        Close
      </button>
    </div>
    <style>{`
      @keyframes fade-in-scale {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-fade-in-scale {
        animation: fade-in-scale 0.25s cubic-bezier(0.4,0,0.2,1);
      }
    `}</style>
  </div>
);

export default CreateTeam;
