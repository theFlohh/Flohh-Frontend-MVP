import React, { useEffect, useState } from "react";
import { fetchUserTeam, fetchUserPointsBreakdown } from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import { fetchMyFriendLeaderboards } from "../../Services/Api";

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userLeagueUrl, setUserLeagueUrl] = useState(null);
  const [pointsBreakdown, setPointsBreakdown] = useState({ totalPoints: 0, weeklyPoints: 0, dailyPoints: 0 });


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
  fetchMyFriendLeaderboards()
]);

// Set first league link if available
if (leagueData?.leaderboards?.length > 0) {
  const firstLeague = leagueData.leaderboards[0];
  setUserLeagueUrl(`/leaderboard/friend/${firstLeague._id}`);
}
      setTeam(teamData);
      setPointsBreakdown(pointsData);
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
    return <div className="flex justify-center items-center min-h-screen bg-gray-50">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">{error}</div>;
  }

  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];

  // These fields are not present in the API response, so fallback to 'N/A' or 0
  const rank = user.rank || 'N/A';
const totalUserPoints = pointsBreakdown.totalPoints;
const weeklyPoints = pointsBreakdown.weeklyPoints;
const dailyPoints = pointsBreakdown.dailyPoints;
  const teamType = user.type || 'Mix';
  const teamName = user.name || 'My Team';
  const teamAvatar = user.avatar || "/logo192.png";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row gap-8 p-4 md:p-8">
      {/* Left Side */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 max-w-sm mx-auto md:mx-0">
        {/* Team Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2">
          <img src={teamAvatar} alt={teamName} className="w-20 h-20 rounded-full object-cover border-4 border-purple-300 mb-2" />
          <div className="text-xl font-bold text-gray-800 flex items-center gap-2">{teamName}</div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <span role="img" aria-label="coin">🪙</span> {totalUserPoints.toLocaleString()} pts
          </div>
        </div>
        {/* Rank & Points */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-400">Rank</div>
            <div className="text-lg font-bold text-purple-600">{rank}</div>
          </div>
          <div className="border-l h-8 mx-2" />
          <div className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-400">Weekly Points</div>
            <div className="text-sm font-semibold text-gray-700">🪙 {weeklyPoints.toLocaleString()} pts</div>
            {/* <button className="mt-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">View League</button> */}
            {userLeagueUrl ? (
  <button
    onClick={() => navigate(userLeagueUrl)}
    className="mt-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium"
  >
    View League
  </button>
) : (
  <span className="mt-1 text-xs text-gray-400">No league joined</span>
)}
          </div>
        </div>
        {/* Team Stats */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Total User Pts :</span>
            <span className="font-semibold text-gray-800">🪙 {totalUserPoints >= 1000000 ? (totalUserPoints/1000000).toFixed(2) + ' Million' : totalUserPoints.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Members :</span>
            <span className="font-semibold text-gray-800">{members.length.toString().padStart(2, '0')}/05</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Type :</span>
            <span className="font-semibold text-gray-800">{teamType}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-purple-100 text-purple-700 font-semibold py-2 rounded-lg hover:bg-purple-200 transition" onClick={() => navigate('/create-team')}>Edit</button>
            <button className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition">Manage</button>
          </div>
        </div>
      </div>
      {/* Right Side: Team Members */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          {members.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No team members found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {members.map((m, idx) => {
                const artist = m.artistId || {};
                return (
                  <div
                    key={artist._id || idx}
                    className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 cursor-pointer hover:bg-purple-50 transition"
                    onClick={() => navigate(`/artist/${artist._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-300 text-gray-700' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-700'}`}>{idx + 1}</div>
                      {/* <img src={artist.image || '/logo192.png'} alt={artist.name || 'Artist'} className="w-12 h-12 rounded-full object-cover border-2 border-purple-300" /> */}
                      <div>
                        <div className="font-semibold text-gray-800 text-base flex items-center gap-2">{artist.name || 'Artist Name'}
                          {m.category && (
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${m.category === 'Legend' ? 'bg-purple-200 text-purple-700' : m.category === 'Trending' ? 'bg-blue-100 text-blue-700' : m.category === 'Standard' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'}`}>{m.category}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'No genres'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold flex items-center gap-1">
                        <svg width="18" height="18" fill="currentColor" className="inline" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        {artist.totalScore?.toLocaleString() || '0'} pts
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
  );
};

export default MyTeam; 