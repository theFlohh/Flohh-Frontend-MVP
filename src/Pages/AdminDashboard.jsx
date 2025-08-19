import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAppOverview,
  fetchAllArtists,
  fetchAllUsers,
} from "../Services/Api";
import Loader from "../Components/Loader";
import {
  FiUsers,
  FiMusic,
  FiGrid,
  FiLogIn,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [artistsData, setArtistsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      setLoading(true);
      const [ov, artistsRes, usersRes] = await Promise.all([
        fetchAppOverview(),
        fetchAllArtists().catch(() => []),
        fetchAllUsers().catch(() => []),
      ]);
      setOverview(ov || {});
      setArtistsData(
        Array.isArray(artistsRes)
          ? artistsRes
          : artistsRes?.artists || artistsRes || []
      );
      setUsersData(
        Array.isArray(usersRes) ? usersRes : usersRes?.users || usersRes || []
      );
    } catch (error) {
      console.error("Error fetching overview:", error);
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

  // Metrics from overview
  const metrics = useMemo(() => {
    if (!overview)
      return {
        totalUsers: 0,
        totalArtists: 0,
        totalTeams: 0,
        newUsersThisWeek: 0,
      };
    return {
      totalUsers: overview.totalUsers || 0,
      totalArtists: overview.totalArtists || 0,
      totalTeams: overview.totalTeams || 0,
      newUsersThisWeek: overview.newUsersThisWeek || 0,
    };
  }, [overview]);

  // Derived datasets from backend overview
  const categoryCounts = overview?.categoryCounts || {};
  const topArtists = overview?.topArtists || [];
  const topTeams = overview?.topTeams || [];
  const topGainers = overview?.topGainers || [];
  const topDecliners = overview?.topDecliners || [];
  const rankMoversUp = overview?.rankMoversUp || [];
  const rankMoversDown = overview?.rankMoversDown || [];
  const topUsers = overview?.topUsers || [];
  const dailyTopArtists = overview?.dailyTopArtists || [];
  const weeklyTopArtists = overview?.weeklyTopArtists || [];
  const monthlyTopArtists = overview?.monthlyTopArtists || [];
  const weeklyTopTeams = overview?.weeklyTopTeams || [];
  const monthlyTopTeams = overview?.monthlyTopTeams || [];

  // Top drafting artists (by draftingPercentage) - take from overview.artistsDrafting if present, else from artistsData
  const topDrafting = useMemo(() => {
    const source = overview?.artistsDrafting?.length
      ? overview.artistsDrafting
      : artistsData.map((a) => ({
          id: a._id,
          name: a.name,
          image: a.image,
          category: a.tier || a.category || null,
          draftingPercentage: a.draftingPercentage || 0,
          totalScore: a.totalScore || 0,
        }));
    return [...source]
      .filter((a) => typeof a.draftingPercentage === "number")
      .sort((a, b) => (b.draftingPercentage || 0) - (a.draftingPercentage || 0))
      .slice(0, 10);
  }, [overview, artistsData]);

  // Top 5 per category (Legend/Trending/Breakout/Standard) by totalScore
  const byCategoryTop5 = useMemo(() => {
    const groups = { Legend: [], Trending: [], Breakout: [], Standard: [] };
    const source = overview?.artistsDrafting?.length
      ? overview.artistsDrafting
      : artistsData.map((a) => ({
          id: a._id,
          name: a.name,
          image: a.image,
          category: a.tier || a.category || null,
          draftingPercentage: a.draftingPercentage || 0,
          totalScore: a.totalScore || 0,
        }));
    source.forEach((a) => {
      const cat = a.category;
      if (cat && groups[cat]) groups[cat].push(a);
    });
    Object.keys(groups).forEach((cat) => {
      groups[cat] = groups[cat]
        .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
        .slice(0, 5);
    });
    return groups;
  }, [overview, artistsData]);

  // Simple area charts data
  const getLastMonths = (n = 6) => {
    const arr = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({
        key: `${d.getFullYear()}-${d.getMonth() + 1}`,
        label: d.toLocaleString("default", { month: "short" }),
      });
    }
    return arr;
  };

  const artistsSeries = useMemo(() => {
    const months = getLastMonths(6);
    const map = months.reduce((acc, m) => ({ ...acc, [m.key]: 0 }), {});
    (Array.isArray(artistsData) ? artistsData : []).forEach((a) => {
      if (!a?.createdAt) return;
      const d = new Date(a.createdAt);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map[k] !== undefined) map[k] += 1;
    });
    const values = months.map((m) => map[m.key]);
    return { labels: months.map((m) => m.label), values };
  }, [artistsData]);

  const usersSeries = useMemo(() => {
    const months = getLastMonths(6);
    const map = months.reduce((acc, m) => ({ ...acc, [m.key]: 0 }), {});
    (Array.isArray(usersData) ? usersData : []).forEach((u) => {
      if (!u?.createdAt) return;
      const d = new Date(u.createdAt);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (map[k] !== undefined) map[k] += 1;
    });
    const values = months.map((m) => map[m.key]);
    return { labels: months.map((m) => m.label), values };
  }, [usersData]);

  const LineArea = ({
    labels,
    values,
    colorFrom = "#794AFE",
    colorTo = "#B292FF",
  }) => {
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
    const areaPath = `M ${padding},${height - padding} L ${points.join(
      " L "
    )} L ${padding + (values.length - 1) * step},${height - padding} Z`;
    const linePath = `M ${points.join(" L ")}`;
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
          <circle
            key={i}
            cx={padding + i * step}
            cy={height - padding - (v / max) * (height - padding * 2)}
            r="2.5"
            fill={colorFrom}
          />
        ))}
        {labels.map((l, i) => (
          <text
            key={l + i}
            x={padding + i * step}
            y={height - 4}
            fontSize="9"
            textAnchor="middle"
            fill="#C4B5FD"
          >
            {l}
          </text>
        ))}
      </svg>
    );
  };

  // Donut gauge (percentage)
  const DonutGauge = ({ value = 0, label = 'Completion' }) => {
    const size = 140;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    const offset = c - (pct / 100) * c;
    return (
      <div className="flex items-center gap-4">
        <svg width={size} height={size} className="shrink-0">
          <circle cx={size/2} cy={size/2} r={r} stroke="#2a2d48" strokeWidth={stroke} fill="none" />
          <circle cx={size/2} cy={size/2} r={r} stroke="#794AFE" strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
          <text x="50%" y="48%" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">{pct}%</text>
          <text x="50%" y="62%" textAnchor="middle" fill="#C4B5FD" fontSize="10">{label}</text>
        </svg>
      </div>
    );
  };

  // Pie chart for login counts (Top 6 users)
  const LoginPie = () => {
    const list = useMemo(() => {
      const arr = Array.isArray(usersData) ? usersData : usersData?.users || [];
      return [...arr]
        .sort((a, b) => (b?.loginCount || 0) - (a?.loginCount || 0))
        .slice(0, 6)
        .map((u) => ({
          label: u.name || u.email || "User",
          value: u.loginCount || 0,
        }));
    }, [usersData]);

    const total = list.reduce((s, x) => s + (x.value || 0), 0) || 1;
    const radius = 54;
    const cx = 60;
    const cy = 60;
    let startAngle = 0;
    const palette = [
      "#865DFF",
      "#B292FF",
      "#6C4BF4",
      "#B56DF3",
      "#7C6CF6",
      "#9F8BFF",
    ];

    const arcs = list.map((item, idx) => {
      const frac = (item.value || 0) / total;
      const angle = frac * Math.PI * 2;
      const endAngle = startAngle + angle;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const color = palette[idx % palette.length];
      startAngle = endAngle;
      return { d, color, item };
    });

    return (
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        <svg viewBox="0 0 120 120" className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64">
          {arcs.map((a, i) => (
            <path key={i} d={a.d} fill={a.color} opacity="0.9" />
          ))}
        </svg>
        <ul className="text-xs text-purple-200/90 space-y-1 max-w-full md:max-w-[240px]">
          {list.map((it, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ background: palette[i % palette.length] }}
              />
              <span className="text-white truncate max-w-[200px] md:max-w-[160px]">
                {it.label}
              </span>
              <span className="ml-2">{it.value}</span>
            </li>
          ))}
        </ul>
      </div>
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
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">Total Users</div>
                  <div className="text-2xl font-bold text-white">
                    {metrics.totalUsers}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiUsers />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">
                    Total Artists
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics.totalArtists}
                  </div>
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
                  <div className="text-2xl font-bold text-white">
                    {metrics.totalTeams}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiGrid />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#1a2050] to-[#111536] rounded-2xl p-4 border border-white/10 hover:border-purple-400/40 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-200/80">
                    New Users (7d)
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics.newUsersThisWeek}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
                  <FiLogIn />
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 max-w-7xl mx-auto">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Gainers (Δ score)</div>
              {topGainers.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {topGainers.map((g, i) => (
                    <li key={`${g.artistId || i}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {g.image ? <img src={g.image} alt={g.name} className="w-6 h-6 rounded"/> : <div className="w-6 h-6 rounded bg-white/10"/>}
                        <span className="text-white truncate max-w-[140px]">{g.name || 'Unknown'}</span>
                      </div>
                      <span className="text-green-400">+{g.delta}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Decliners (Δ score)</div>
              {topDecliners.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {topDecliners.map((d, i) => (
                    <li key={`${d.artistId || i}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {d.image ? <img src={d.image} alt={d.name} className="w-6 h-6 rounded"/> : <div className="w-6 h-6 rounded bg-white/10"/>}
                        <span className="text-white truncate max-w-[140px]">{d.name || 'Unknown'}</span>
                      </div>
                      <span className="text-red-400">{d.delta}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Rank Movers Up</div>
              {rankMoversUp.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {rankMoversUp.map((r, i) => (
                    <li key={`${r.artistId || i}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {r.image ? <img src={r.image} alt={r.name} className="w-6 h-6 rounded"/> : <div className="w-6 h-6 rounded bg-white/10"/>}
                        <span className="text-white truncate max-w-[140px]">{r.name || 'Unknown'}</span>
                      </div>
                      <span className="text-green-400">+{r.deltaRank}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Rank Movers Down</div>
              {rankMoversDown.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {rankMoversDown.map((r, i) => (
                    <li key={`${r.artistId || i}`} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {r.image ? <img src={r.image} alt={r.name} className="w-6 h-6 rounded"/> : <div className="w-6 h-6 rounded bg-white/10"/>}
                        <span className="text-white truncate max-w-[140px]">{r.name || 'Unknown'}</span>
                      </div>
                      <span className="text-red-400">{r.deltaRank}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
          </section>

          {/* Timeframe Top Artists */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Artists Today</div>
              {dailyTopArtists.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {dailyTopArtists.slice(0, 5).map((a, i) => (
                    <li key={`${a.artistId || i}`} className="flex items-center justify-between gap-2">
                      <span className="text-white truncate max-w-[160px]">{a.name}</span>
                      <span>{a.score}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Artists (7d)</div>
              {weeklyTopArtists.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {weeklyTopArtists.slice(0, 5).map((a, i) => (
                    <li key={`${a.artistId || i}`} className="flex items-center justify-between gap-2">
                      <span className="text-white truncate max-w-[160px]">{a.name}</span>
                      <span>{a.totalScore}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Artists (30d)</div>
              {monthlyTopArtists.length ? (
                <ul className="space-y-2 text-xs text-purple-200/90">
                  {monthlyTopArtists.slice(0, 5).map((a, i) => (
                    <li key={`${a.artistId || i}`} className="flex items-center justify-between gap-2">
                      <span className="text-white truncate max-w-[160px]">{a.name}</span>
                      <span>{a.totalScore}</span>
                    </li>
                  ))}
                </ul>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 max-w-7xl mx-auto">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Teams (7d)</div>
              {weeklyTopTeams.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs text-purple-200/90">
                    <thead>
                      <tr className="text-purple-300">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Team</th>
                        <th className="py-2 pr-4">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyTopTeams.slice(0, 5).map((t, i) => (
                        <tr key={`${t.teamId || i}`} className="border-t border-white/10">
                          <td className="py-2 pr-4">{i + 1}</td>
                          <td className="py-2 pr-4">{t.teamName || 'Unnamed'}</td>
                          <td className="py-2 pr-4">{t.totalPoints || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">Top Teams (30d)</div>
              {monthlyTopTeams.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs text-purple-200/90">
                    <thead>
                      <tr className="text-purple-300">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Team</th>
                        <th className="py-2 pr-4">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTopTeams.slice(0, 5).map((t, i) => (
                        <tr key={`${t.teamId || i}`} className="border-t border-white/10">
                          <td className="py-2 pr-4">{i + 1}</td>
                          <td className="py-2 pr-4">{t.teamName || 'Unnamed'}</td>
                          <td className="py-2 pr-4">{t.totalPoints || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="text-purple-200/80 text-sm">No data.</div>)}
            </div>
          </section>
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
            {/* Category Top 5s first (Legend/Trending/Breakout/Standard) */}
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Legend", "Trending", "Breakout", "Standard"].map((cat) => (
                <div
                  key={cat}
                  className="bg-[#131d3e] rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-sm font-semibold text-white mb-3">
                    Top {cat}
                  </div>
                  {byCategoryTop5[cat]?.length ? (
                    <ul className="space-y-3">
                      {byCategoryTop5[cat].map((a, i) => (
                        <li
                          key={`${cat}-${a.id || i}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {a.image ? (
                              <img
                                src={a.image}
                                alt={a.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-white/10" />
                            )}
                            <div className="min-w-0">
                              <div className="text-white text-sm truncate">
                                {a.name}
                              </div>
                              <div className="text-[11px] text-purple-200/80 truncate">
                                {a.totalScore?.toLocaleString?.() ||
                                  a.totalScore ||
                                  0}{" "}
                                pts
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-purple-200/80">
                            {a.category || cat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-purple-200/80 text-sm">No data.</div>
                  )}
                </div>
              ))}
          </div>

            {/* Artists by Category (counts) */}
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">
                  Artist Categories
                </div>
                <FiBarChart2 className="text-purple-300" />
              </div>
              {Object.keys(categoryCounts).length ? (
                <div className="space-y-3">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const max = Math.max(...Object.values(categoryCounts));
                    const pct = Math.max(
                      8,
                      Math.round(((count || 0) / (max || 1)) * 100)
                    );
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between text-xs text-purple-200/80 mb-1">
                          <span className="truncate pr-2 text-white">
                            {cat}
                          </span>
                          <span>{count}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#794AFE] to-[#B292FF]"
                            style={{ width: pct + "%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-purple-200/80 text-sm">No data.</div>
              )}
            </div>

            {/* Top Artists by Score */}
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">
                  Top Artists by Score
                </div>
                <FiTrendingUp className="text-purple-300" />
              </div>
              {topArtists.length ? (
                <div className="space-y-3">
                  {topArtists.map((a, idx) => {
                    const max = topArtists[0]?.totalScore || 1;
                    const pct = Math.max(
                      5,
                      Math.round(((a?.totalScore || 0) / max) * 100)
                    );
                    return (
                      <div key={`${a.artistId || idx}`} className="">
                        <div className="flex items-center justify-between text-xs text-purple-200/80 mb-1">
                          <span className="truncate pr-2 text-white">
                            {a.name}
              </span>
                          <span>{a.totalScore || 0} pts</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#794AFE] to-[#B292FF]"
                            style={{ width: pct + "%" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-purple-200/80 text-sm">No data.</div>
              )}
          </div>

            {/* Top Teams table */}
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">
                Top Teams (All-time)
              </div>
              {topTeams.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs text-purple-200/90">
                    <thead>
                      <tr className="text-purple-300">
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Team</th>
                        <th className="py-2 pr-4">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTeams.map((t, i) => (
                        <tr
                          key={`${t.teamId || i}`}
                          className="border-t border-white/10"
                        >
                          <td className="py-2 pr-4">{i + 1}</td>
                          <td className="py-2 pr-4">
                            {t.teamName || "Unnamed"}
                          </td>
                          <td className="py-2 pr-4">{t.totalPoints || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-purple-200/80 text-sm">No data.</div>
              )}
            </div>
          </section>
          
          {/* Top Drafting + Login Pie */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-white">
                  Top Drafting Artists
                </div>
                <FiTrendingUp className="text-purple-300" />
              </div>
              {topDrafting.length ? (
                <ul className="space-y-3">
                  {topDrafting.map((a, i) => (
                    <li
                      key={`${a.id || i}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {a.image ? (
                          <img
                            src={a.image}
                            alt={a.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-white/10" />
                        )}
                        <div className="min-w-0">
                          <div className="text-white text-sm truncate">
                            {a.name}
                          </div>
                          <div className="text-[11px] text-purple-200/80 truncate">
                            {a.category || "—"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-yellow-300 text-xs">
                          {a.totalScore?.toLocaleString?.() ||
                            a.totalScore ||
                            0}{" "}
                          pts
                        </div>
                        <div className="text-green-300 text-[11px]">
                          {a.draftingPercentage || 0}% drafting
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-purple-200/80 text-sm">No data.</div>
              )}
            </div>
            <div className="bg-[#131d3e] rounded-2xl p-4 border border-white/10">
              <div className="text-sm font-semibold text-white mb-3">
                Login Count (Top Users)
              </div>
              <LoginPie />
            </div>
          </section>
          {/* Trends & Movers */}
          

          {/* Teams by timeframe */}
          
        </>
      )}
    </>
  );
};

export default AdminDashboard;
