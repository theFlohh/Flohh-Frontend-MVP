import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllArtists, fetchAllUsers } from "../Services/Api";
import Loader from "../Components/Loader";
import { FiUsers, FiMusic, FiGrid, FiLogIn, FiTrendingUp, FiBarChart2 } from "react-icons/fi";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const [artistsRes, usersRes] = await Promise.all([
        fetchAllArtists(),
        fetchAllUsers().catch(() => []),
      ]);
      setData(artistsRes || []);
      setUsers(Array.isArray(usersRes) ? usersRes : (usersRes?.users || []));
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleViewClick = async (artistId) => {
  //   const summary = await fetchArtistSummary(artistId);
  //   setSelectedArtist(summary);
  //   setModalOpen(true);
  // };

  useEffect(() => {
    getData();
  }, []);

  // const handleAddArtistCSV = () => {
  //   navigate("/add-artist-csv");
  // };

  // Pagination logic
  // const totalPages = Math.ceil(data.length / rowsPerPage);
  // const currentRows = data.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  // Metrics
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalArtists = data.length;
    const totalTeams = users.filter((u) => u?.draftedTeam?.userTeam).length;
    const totalLogins = users.reduce((sum, u) => sum + (u?.loginCount || 0), 0);
    return { totalUsers, totalArtists, totalTeams, totalLogins };
  }, [users, data]);

  const topArtists = useMemo(() => {
    const sorted = [...data].sort((a, b) => (b?.totalScore || 0) - (a?.totalScore || 0));
    return sorted.slice(0, 5);
  }, [data]);

  const topGenres = useMemo(() => {
    const counts = {};
    data.forEach((a) => (a.genres || []).forEach((g) => { counts[g] = (counts[g] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [data]);

  // Simple area charts data
  const getLastMonths = (n = 6) => {
    const arr = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString('default', { month: 'short' }) });
    }
    return arr;
  };

  const artistsSeries = useMemo(() => {
    const months = getLastMonths(6);
    const map = months.reduce((acc, m) => ({ ...acc, [m.key]: 0 }), {});
    data.forEach((a) => {
      if (!a?.createdAt) return;
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map[key] !== undefined) map[key] += 1;
    });
    const values = months.map((m) => map[m.key]);
    return { labels: months.map((m) => m.label), values };
  }, [data]);

  const usersSeries = useMemo(() => {
    const months = getLastMonths(6);
    const map = months.reduce((acc, m) => ({ ...acc, [m.key]: 0 }), {});
    users.forEach((u) => {
      if (!u?.createdAt) return;
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map[key] !== undefined) map[key] += 1;
    });
    const values = months.map((m) => map[m.key]);
    return { labels: months.map((m) => m.label), values };
  }, [users]);

  const LineArea = ({ labels, values, colorFrom = '#794AFE', colorTo = '#B292FF' }) => {
    const width = 320;
    const height = 120;
    const padding = 20;
    const max = Math.max(1, ...values);
    const step = (width - padding * 2) / Math.max(1, values.length - 1);
    const points = values.map((v, i) => {
      const x = padding + i * step;
      const y = height - padding - (v / max) * (height - padding * 2);
      return `${x},${y}`;
    });
    const areaPath = `M ${padding},${height - padding} L ${points.join(' L ')} L ${padding + (values.length - 1) * step},${height - padding} Z`;
    const linePath = `M ${points.join(' L ')}`;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#grad)" />
        <path d={linePath} fill="none" stroke={colorFrom} strokeWidth="2" />
        {values.map((v, i) => (
          <circle key={i} cx={padding + i * step} cy={height - padding - (v / max) * (height - padding * 2)} r="2.5" fill={colorFrom} />
        ))}
        {labels.map((l, i) => (
          <text key={l + i} x={padding + i * step} y={height - 4} fontSize="9" textAnchor="middle" fill="#C4B5FD">{l}</text>
        ))}
      </svg>
    );
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-[#191825]">
          <Loader />
        </div>
      ) : (
        <>
          {/* Header */}
          {/* <header className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1">Overview of users, artists, and activity</p>
            </div>
            <button
              onClick={handleAddArtistCSV}
              className="bg-gradient-to-r from-[#865DFF] to-[#E384FF] hover:opacity-90 px-5 py-2 rounded-full text-white font-semibold shadow-md transition-all w-full sm:w-auto"
            >
              Add Artist using CSV
            </button>
          </header> */} 

          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">Total Users</div>
                  <div className="text-2xl font-bold text-white">{metrics.totalUsers}</div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiUsers />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">Total Artists</div>
                  <div className="text-2xl font-bold text-white">{metrics.totalArtists}</div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiMusic />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">User Teams</div>
                  <div className="text-2xl font-bold text-white">{metrics.totalTeams}</div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiGrid />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">Total Logins</div>
                  <div className="text-2xl font-bold text-white">{metrics.totalLogins}</div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiLogIn />
                </div>
              </div>
          </div>
          </section>

          {/* Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">Top Artists by Score</div>
                <FiTrendingUp className="text-purple-300" />
              </div>
              {topArtists.length === 0 ? (
                <div className="text-purple-200/80 text-sm">No data.</div>
              ) : (
                <div className="space-y-3">
                  {topArtists.map((a) => {
                    const max = topArtists[0]?.totalScore || 1;
                    const pct = Math.max(5, Math.round(((a?.totalScore || 0) / max) * 100));
                    return (
                      <div key={a._id} className="">
                        <div className="flex items-center justify-between text-xs text-purple-200/80 mb-1">
                          <span className="truncate pr-2 text-white">{a.name}</span>
                          <span>{a.totalScore || 0} pts</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#794AFE] to-[#B292FF]" style={{ width: pct + '%' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">Users Activity Snapshot</div>
                <FiBarChart2 className="text-purple-300" />
              </div>
              <div className="flex items-end gap-2 h-28">
                {users.slice(0, 12).map((u) => {
                  const val = Math.min(100, (u?.loginCount || 0) * 10);
                  return (
                    <div key={u._id} className="flex-1 bg-white/10 rounded relative">
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#865DFF] to-[#B292FF] rounded" style={{ height: `${val}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] text-purple-200/80">Recent users (by login count)</div>
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">Top Genres</div>
                <FiMusic className="text-purple-300" />
              </div>
              {topGenres.length === 0 ? (
                <div className="text-purple-200/80 text-sm">No data.</div>
              ) : (
                <div className="space-y-3">
                  {topGenres.map(([g, c], idx) => {
                    const max = topGenres[0]?.[1] || 1;
                    const pct = Math.max(10, Math.round((c / max) * 100));
                    return (
                      <div key={g}>
                        <div className="flex items-center justify-between text-xs text-purple-200/80 mb-1">
                          <span className="truncate pr-2 text-white">{g}</span>
                          <span>{c}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#6C4BF4] to-[#B56DF3]" style={{ width: pct + '%' }} />
                        </div>
                      </div>
                    );
                  })}
          </div>
              )}
            </div>
          </section>

          {/* Time Series */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-2">Artists Added (Last 6 Months)</div>
              <LineArea labels={artistsSeries.labels} values={artistsSeries.values} />
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-2">New Users (Last 6 Months)</div>
              <LineArea labels={usersSeries.labels} values={usersSeries.values} colorFrom="#6C4BF4" colorTo="#B56DF3" />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default AdminDashboard;
