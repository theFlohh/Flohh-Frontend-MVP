import React, { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../../Services/Api";
import Loader from "../../Components/Loader";
import FriendsList from "./FriendsList";
import EntityTabs from "./components/EntityTabs";
import TimeframeFilter from "./components/TimeframeFilter";
import LeaderboardRow from "./components/LeaderboardRow";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";

const rankIcons = [
  "/img/gold.png", // 🥇
  "/img/sliver.png", // 🥈
  "/img/brozne.png", // 🥉
];

const ITEMS_PER_PAGE = 10;

const GlobalLeaderboard = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [entity, setEntity] = useState("users"); // 'users' | 'artists'
  const [timeframe, setTimeframe] = useState("weekly");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchGlobalLeaderboard(entity, timeframe);
        setItems(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset to first page on reload
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    getLeaderboard();
  }, [timeframe, entity]);

  // Pagination logic
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((it) => {
        const name = (it.name || "").toLowerCase();
        const email = (it.email || "").toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      })
    : items;

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  return (
    <div className="">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center sm:text-left">Global Leaderboard</h1>

      <div className="flex bg-[#1e294a] rounded-full p-1 w-full sm:w-fit mb-6 mx-auto sm:mx-0 overflow-x-auto whitespace-nowrap justify-center">
        {["global", "friends", "moves"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-md"
                : "text-white opacity-60 hover:opacity-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "global" && (
        <div className="w-full p-4 sm:p-6 bg-[#121e3f] rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="w-full sm:w-auto">
              <EntityTabs entity={entity} onChange={(val) => { setEntity(val); setCurrentPage(1); }} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-auto"> 
                <TimeframeFilter timeframe={timeframe} onChange={(val) => { setTimeframe(val); setCurrentPage(1); }} />
              </div>
              <div className="w-full sm:w-64 min-w-0">
                <SearchBar
                  value={searchQuery}
                  onChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                  placeholder={entity === "artists" ? "Search artists" : "Search users"}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]"><Loader /></div>
          ) : (
            <>
              {currentItems.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <p className="text-white font-semibold mb-1">{normalizedQuery ? "No results found" : "No data available"}</p>
                    <p className="text-gray-400 text-sm">{normalizedQuery ? "Try a different search term." : "Try switching timeframe or check back later."}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentItems.map((item, index) => (
                    <LeaderboardRow
                      key={item._id || item.id || index}
                      item={item}
                      rank={index + indexOfFirstItem}
                      rankIcons={rankIcons}
                      entity={entity}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "friends" && <FriendsList />}

      {activeTab === "moves" && (
        <div className="bg-[#121e3f] p-6 rounded-lg shadow-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-gray-400">Stay tuned for awesome updates!</p>
        </div>
      )}
    </div>
  );
};

export default GlobalLeaderboard;
