import React, { useEffect, useState } from "react";
import {
  fetchUserTeam,
  fetchUserPointsBreakdown,
  updateDraft,
  fetchMyFriendLeaderboards,
} from "../../Services/Api";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";

const PopupModal = ({ message, onClose }) => (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
      <p className="mb-6 text-lg font-medium">{message}</p>
      <button
        onClick={onClose}
        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg shadow"
      >
        OK
      </button>
    </div>
  </div>
);

const MyTeam = () => {
  const navigate = useNavigate();

  // States - sab top pe
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLeagueUrl, setUserLeagueUrl] = useState(null);
  const [pointsBreakdown, setPointsBreakdown] = useState({
    totalPoints: 0,
    weeklyPoints: 0,
    dailyPoints: 0,
  });
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamNameLoading, setTeamNameLoading] = useState(false);
  const [teamNameError, setTeamNameError] = useState("");
  const [teamNameSuccess, setTeamNameSuccess] = useState("");
  const [popupMessage, setPopupMessage] = useState(null);

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const BASE_URL = "https://floahh-backend.onrender.com/";

  useEffect(() => {
    const getTeam = async () => {
      try {
        const [teamData, pointsData, leagueData] = await Promise.all([
          fetchUserTeam(),
          fetchUserPointsBreakdown(),
          fetchMyFriendLeaderboards(),
        ]);

        if (leagueData?.leaderboards?.length > 0) {
          const firstLeague = leagueData.leaderboards[0];
          setUserLeagueUrl(`/leaderboard/friend/${firstLeague._id}`);
        }

        setTeam(teamData);
        setPointsBreakdown(pointsData);
        setNewTeamName(teamData?.userTeam?.teamName || "");
      } catch (err) {
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };
    getTeam();
  }, []);

  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];
  const rank = team?.teamRank || "N/A";
  const totalUserPoints = pointsBreakdown.totalPoints;
  const weeklyPoints = pointsBreakdown.weeklyPoints;
  const teamType = user.type || "Mix";
  const teamName = user.teamName || "";
  // const user = team?.userTeam || {};

  const teamAvatar = team?.userProfileImage?.startsWith("http")
    ? team.userProfileImage
    : team?.userProfileImage
    ? `${BASE_URL}${team.userProfileImage}`
    : user.avatar?.startsWith("http")
    ? user.avatar
    : user.avatar
    ? `${BASE_URL}${user.avatar}`
    : null;

  // Just for debug
  useEffect(() => {
    console.log("Avatar from backend:", team?.userTeam?.avatar);
    console.log("Full URL:", teamAvatar);
    console.log("Full team object from API:", team);
  }, [team]);

  const getCategoryMeta = (category) => {
    switch (category) {
      case "Legend":
        return { icon: "/img/medal-yellow.png", chip: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30" };
      case "Trending":
        return { icon: "/img/medal-red.png", chip: "bg-red-500/20 text-red-200 border-red-400/30" };
      case "Breakout":
        return { icon: "/img/medal-purple.png", chip: "bg-purple-600/20 text-purple-200 border-purple-500/30" };
      case "Standard":
        return { icon: "/img/star.png", chip: "bg-blue-500/20 text-blue-200 border-blue-400/30" };
      default:
        return { icon: "/img/star.png", chip: "bg-white/10 text-white border-white/20" };
    }
  };

  const handleTeamNameSave = async () => {
    if (!newTeamName.trim()) {
      setPopupMessage("❌ Team name cannot be empty.");
      return;
    }
    setTeamNameLoading(true);
    try {
      const draftedArtists = members.map((m) => m.artistId?._id || m.artistId);
      await updateDraft(draftedArtists, newTeamName.trim());
      setEditingTeamName(false);
      setPopupMessage("✅ Team name updated!");
      const updated = await fetchUserTeam();
      setTeam(updated);
    } catch (e) {
      setPopupMessage("❌ Failed to update team name.");
    } finally {
      setTeamNameLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarSave = async () => {
    if (!avatarFile) return;
    const draftedArtists = members.map((m) => m.artistId?._id || m.artistId);
    setTeamNameLoading(true);
    try {
      await updateDraft(
        draftedArtists,
        newTeamName.trim() || teamName,
        avatarFile
      );

      setPopupMessage("✅ Avatar updated successfully!");

      // Fetch updated team with new avatar
      const updated = await fetchUserTeam();

      setTeam(updated);

      // Clear only the file, keep preview until updated state has it
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      setPopupMessage("❌ Failed to update avatar.");
    } finally {
      setTeamNameLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && avatarFile) {
        handleAvatarSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [avatarFile]);

  // Rendering
  if (loading) return <Loader />;
  // After loading check

  // If no team created yet
  if (error || !team || !team.userTeam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-md w-full">
          <div className="text-xl font-bold text-gray-200 text-center flex flex-col items-center">
            <img src="/img/team.png" alt="team" />
            You haven't created a team yet.
          </div>
          <div className="text-gray-500 text-center mb-2">
            Start building your dream team to compete on the leaderboard!
          </div>
          <button
            className="mt-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow transition text-base"
            onClick={() => navigate("/create-team")}
          >
            Create Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {popupMessage && (
        <PopupModal
          message={popupMessage}
          onClose={() => setPopupMessage(null)}
        />
      )}
      <div className="min-h-screen text-white p-4 font-sans relative">
        <div className="max-w-6xl mx-auto relative">
          <div
            className="relative w-full h-32 md:h-40 rounded-2xl mb-2 md:mb-22 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url('/img/banner-rect1.png')` }}
          ></div>
          <div className="relative sm:absolute sm:top-20 sm:left-7 flex flex-col sm:flex-row sm:items-center gap-4 px-2 sm:px-0">
            <div className="relative w-28 h-28 sm:w-40 sm:h-40">
              <img
                src={avatarPreview || teamAvatar || "/img/default-avatar.png"}
                alt={teamName || "Team Avatar"}
                className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 border-purple-400 object-cover shadow-lg"
              />

              {/* Upload / Save Button - Right side of image */}
              <div className="absolute -bottom-2 right-0 sm:top-3/4 sm:-translate-y-1/2 sm:bottom-auto flex flex-col gap-2">
                {!avatarFile ? (
                  <label
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg shadow cursor-pointer text-sm flex items-center justify-center"
                    aria-label="Upload avatar"
                    title="Upload"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4A1 1 0 1 1 8.707 10.293L11 12.586V4a1 1 0 0 1 1-1z"/>
                      <path d="M5 18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a1 1 0 1 1 2 0v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2a1 1 0 1 1 2 0v2z"/>
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                ) : (
                  <button
                    onClick={handleAvatarSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-sm flex items-center justify-center"
                    aria-label="Save avatar"
                    title="Save"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.414A2 2 0 0 0 18.414 6L17 4.586A2 2 0 0 0 15.586 4H15v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4H7v16h10V8h-3a1 1 0 1 1 0-2h1.586L17 7.414V19H7V5h2v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5h3z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Team Name Section */}
            <div className="mt-4 sm:mt-18 w-full sm:w-auto mb-4">
              <div className="text-2xl md:text-3xl font-bold">
                {editingTeamName || !teamName ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="h-9 px-3 rounded-md bg-[#2a2d48] border border-purple-500 focus:border-purple-400 text-white placeholder-gray-400 outline-none w-full sm:w-auto flex-1 min-w-0"
                    />
                    <button
                      onClick={handleTeamNameSave}
                      disabled={teamNameLoading}
                      className="h-9 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm flex items-center justify-center shrink-0"
                      aria-label="Save team name"
                      title="Save"
                    >
                      {teamNameLoading ? (
                        "Saving..."
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.414A2 2 0 0 0 18.414 6L17 4.586A2 2 0 0 0 15.586 4H15v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V4H7v16h10V8h-3a1 1 0 1 1 0-2h1.586L17 7.414V19H7V5h2v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5h3z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => setEditingTeamName(true)}
                  >
                    {teamName}
                  </div>
                )}
              </div>
              <div className="text-sm text-yellow-400 flex items-center gap-1 mt-1">
                <img
                  src="/img/game-icons_two-coins.png"
                  alt="coin"
                  className="w-4 h-4 object-contain"
                />{" "}
                {totalUserPoints.toLocaleString()} pts
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div>
                    <div className="text-xl text-gray-300">Rank</div>
                    <div className="text-xl font-bold text-yellow-300">
                      #{rank}
                    </div>
                  </div>
                  <div className="border-l border-gray-500 h-10 hidden sm:block"></div>
                  <div>
                    <div className="text-lg text-gray-300">Weekly Points</div>
                    <div className="text-base font-semibold flex items-center gap-1 text-yellow-400">
                      <img
                        src="/img/game-icons_two-coins.png"
                        alt="coin"
                        className="w-6 h-6 object-contain"
                      />
                      {weeklyPoints.toLocaleString()}
                    </div>
                    {userLeagueUrl ? (
                      <button
                        onClick={() => navigate(userLeagueUrl)}
                        className="mt-1 px-3 py-1 text-xs bg-purple-700 hover:bg-purple-800 text-white rounded-full font-medium transition"
                      >
                        View League
                      </button>
                    ) : (
                      <span className="mt-1 text-xs text-gray-400">
                        No league joined
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg space-y-3 text-sm text-white">
                <div className="text-lg flex justify-between">
                  <span>Total User Pts:</span>
                  <span className="flex items-center gap-1">
                    <img
                      src="/img/game-icons_two-coins.png"
                      alt="coin"
                      className="w-6 h-6 object-contain"
                    />{" "}
                    {totalUserPoints >= 1000000
                      ? (totalUserPoints / 1000000).toFixed(2) + " Million"
                      : totalUserPoints.toLocaleString()}
                  </span>
                </div>
                <div className="text-lg flex justify-between">
                  <span>Members:</span>
                  <span>{members.length.toString().padStart(2, "0")}/07</span>
                </div>
                <div className="text-lg flex justify-between">
                  <span>Type:</span>
                  <span>{teamType}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-5 bg-[#794AFE] hover:bg-[#794AFE] text-white font-semibold py-2 rounded-full transition"
                    onClick={() => navigate("/create-team")}
                  >
                    Edit
                  </button>
                  <button className="px-5 bg-gray-700 text-white font-semibold py-2 rounded-full hover:bg-gray-600 transition">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2  rounded-xl shadow-lg">
              {members.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No team members found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {members.map((m, idx) => {
                    const artist = m.artistId || {};
                    return (
                      <div
                        key={artist._id || idx}
                        className="relative bg-[#1f223e] border border-[#353751] rounded-xl p-5 shadow-lg hover:scale-105 transform transition cursor-pointer flex flex-col items-start text-center"
                        onClick={() => navigate(`/artist/${artist._id}`)}
                      >
                        {m.category && (() => {
                          const meta = getCategoryMeta(m.category);
                          return (
                            <span className={`absolute top-2 right-2 flex items-center gap-1 px-0.5 py-0.5 rounded-full text-[10px] sm:text-xs border ${meta.chip}`}>
                              <img src={meta.icon} alt={m.category} className="w-6 h-6"/>
                            </span>
                          );
                        })()}
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full gap-2 mb-3 border-b border-gray-600 ">
                          <div className="flex flex-col justify-start min-w-0">
                            <h3 className="font-semibold text-md text-white mb-1 text-left">
                              {artist.name || "Artist Name"}
                            </h3>
                            <p className="text-yellow-400 text-sm mb-3 flex items-center gap-1">
                              <img
                                src="/img/game-icons_two-coins.png"
                                alt="coin"
                                className="w-3 h-3 object-contain"
                              />
                              {artist.totalScore?.toLocaleString() || "0"} pts
                            </p>
                          </div>
                          
                        </div>
                        {/* Drafting Percentage */}
                        <div className="flex flex-row gap-2 flex-wrap">
                          <div className="bg-[#2a2d48] px-4 py-2 rounded-full text-[12px] text-gray-300 mb-3">
                            Drafting : {artist?.draftingPercentage || "0"}%{" "}
                          </div>
                          <span className="bg-[#2a2d48] rounded-full px-2 py-1 text-xs mb-3">
                            {artist.rank && artist.previousRank ? (
                              artist.rank < artist.previousRank ? (
                                // Rank improved
                                <img
                                  src="/img/auto-conversations.png"
                                  alt="Rank Up"
                                  className="w-6 h-6"
                                />
                              ) : artist.rank > artist.previousRank ? (
                                // Rank dropped
                                <img
                                  src="/img/auto-conversations1.png"
                                  alt="Rank Down"
                                  className="w-6 h-6"
                                />
                              ) : (
                                // Rank same
                                <img
                                  src="/img/auto-conversations.png"
                                  alt="Rank Same"
                                  className="w-6 h-6"
                                />
                              )
                            ) : "0"}
                          </span>
                        </div>
                        {/* Category Button */}

                        {/* Swap Button */}
                        <div className="block items-center w-full ">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent card click (navigate to artist)
                              navigate("/redraft", {
                                state: {
                                  category: m.category,
                                  currentMemberId: m._id,
                                },
                              });
                            }}
                            className="flex flex-row  mx-auto items-center gap-2 px-5 py-1.5 bg-[#A68CFF] hover:bg-[#B393FE] text-black  font-semibold rounded-full transition"
                          >
                            <img
                              src="img/coins-swap.png"
                              alt=""
                              className="w-4 h-4"
                            />
                            Swap
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTeam;
