import React, { useEffect, useState } from "react";
import {
  fetchUserTeam,
  fetchUserPointsBreakdown,
  updateDraft,
} from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import { fetchMyFriendLeaderboards } from "../../Services/Api";
import Loader from "../../Components/Loader";

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const getTeam = async () => {
      try {
        // const [teamData, pointsData] = await Promise.all([
        //   fetchUserTeam(),
        //   fetchUserPointsBreakdown()
        // ]);
        const [teamData, pointsData, leagueData] = await Promise.all([
          fetchUserTeam(),
          fetchUserPointsBreakdown(),
          fetchMyFriendLeaderboards(),
        ]);

        // Set first league link if available
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

  // useEffect(() => {
  //   const getTeam = async () => {
  //     try {
  //       const data = await fetchUserTeam();
  //       setTeam(data);
  //     } catch (err) {
  //       setError("Failed to load team data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getTeam();
  // }, []);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-md w-full">
          <div className="text-xl font-bold text-gray-200 text-center flex flex-col items-center">
            <img src="/img/team.png" alt="team"/>
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

  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];

  // These fields are not present in the API response, so fallback to 'N/A' or 0
  const rank = user.rank || "N/A";
  const totalUserPoints = pointsBreakdown.totalPoints;
  const weeklyPoints = pointsBreakdown.weeklyPoints;
  const dailyPoints = pointsBreakdown.dailyPoints;
  const teamType = user.type || "Mix";
  const teamName = user.teamName || "My Team";
  const teamAvatar = user.avatar || "/logoflohh.png";

  const handleTeamNameSave = async () => {
    if (!newTeamName.trim()) {
      setTeamNameError("Team name cannot be empty.");
      return;
    }
    setTeamNameLoading(true);
    setTeamNameError("");
    setTeamNameSuccess("");
    try {
      // Collect draftedArtists ids
      const draftedArtists = (team?.teamMembers || []).map(
        (m) => m.artistId?._id || m.artistId
      );
      await updateDraft(draftedArtists, newTeamName.trim());
      setEditingTeamName(false);
      setTeamNameSuccess("Team name updated!");
      setTimeout(() => setTeamNameSuccess(""), 2000);
      // Optionally, refetch team
      const updated = await fetchUserTeam();
      setTeam(updated);
    } catch (e) {
      setTeamNameError("Failed to update team name.");
    } finally {
      setTeamNameLoading(false);
    }
  };

  return (
    // Top part of the same code...

<div className="min-h-screen bg-gradient-to-br from-[#0d0221] to-[#1a033b] text-white p-4 md:p-8 font-sans">
  <div className="max-w-6xl mx-auto">
    {/* Profile Banner */}
    <div
      className="relative w-full h-40 md:h-52 rounded-2xl mb-8 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('/img/banner-rect.png')`,
      }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" /> */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 z-10">
        <img
          src={teamAvatar}
          alt={teamName}
          className="w-20 h-20 rounded-full border-4 border-purple-400 object-cover shadow-lg"
        />
        <div>
          <div className="text-2xl md:text-3xl font-bold">{teamName}</div>
          <div className="text-sm text-yellow-400 flex items-center gap-1 mt-1">
            🪙 {totalUserPoints.toLocaleString()} pts
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Card */}
      <div className="space-y-6">
        {/* Rank + Weekly */}
        <div className="bg-[#24124d] rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-300">Rank</div>
              <div className="text-xl font-bold text-yellow-300">#{rank}</div>
            </div>
            <div className="border-l border-gray-500 h-10 mx-3"></div>
            <div>
              <div className="text-sm text-gray-300">Weekly Points</div>
              <div className="text-base font-semibold">
                🪙 {weeklyPoints.toLocaleString()}
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

        {/* Stats Card */}
        <div className="bg-[#24124d] rounded-xl p-4 shadow-lg space-y-2 text-sm text-white">
          <div className="flex justify-between">
            <span>Total User Pts :</span>
            <span>
              🪙{" "}
              {totalUserPoints >= 1000000
                ? (totalUserPoints / 1000000).toFixed(2) + " Million"
                : totalUserPoints.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Members :</span>
            <span>{members.length.toString().padStart(2, "0")}/07</span>
          </div>
          <div className="flex justify-between">
            <span>Type :</span>
            <span>{teamType}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition"
              onClick={() => navigate("/create-team")}
            >
              Edit
            </button>
            <button className="flex-1 bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition">
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Members Card */}
      <div className="md:col-span-2 bg-[#24124d] rounded-xl p-4 sm:p-6 shadow-lg">
        {members.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No team members found.
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((m, idx) => {
              const artist = m.artistId || {};
              return (
                <div
                  key={artist._id || idx}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#2e1a5d] hover:bg-[#3a2272] transition rounded-xl px-4 py-3 cursor-pointer"
                  onClick={() => navigate(`/artist/${artist._id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                        idx === 0
                          ? "bg-yellow-400 text-white"
                          : idx === 1
                          ? "bg-gray-300 text-black"
                          : idx === 2
                          ? "bg-orange-400 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-2 flex-wrap">
                        {artist.name || "Artist Name"}
                        {m.category && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              m.category === "Legend"
                                ? "bg-purple-600 text-white"
                                : m.category === "Trending"
                                ? "bg-blue-600 text-white"
                                : m.category === "Breakout"
                                ? "bg-pink-600 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {m.category}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-300">
                        {artist.genres && artist.genres.length > 0
                          ? artist.genres.join(", ")
                          : "No genres"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end text-sm mt-2 sm:mt-0">
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      🪙 {artist.totalScore?.toLocaleString() || "0"} pts
                    </span>
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

  );
};

export default MyTeam;
