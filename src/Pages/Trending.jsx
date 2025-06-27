import React, { useEffect, useState } from "react";
import { fetchTrendingArtists, fetchArtistSummary } from "../Services/Api";
import { FiEye } from "react-icons/fi";
import TrendingModal from "../Components/TrendingModal";

const TrendingPage = () => {
  const [trendingData, setTrendingData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      console.log("Fetching trending artists...");
      const trending = await fetchTrendingArtists();
      console.log("Trending API Response:", trending);

      console.log("Fetching summary for each artist...");
      const scores = await Promise.all(
        trending.map((artist) =>
          fetchArtistSummary(artist.artistId).then((summary) => {
            console.log(`Summary for ${artist.name} (${artist.artistId}):`, summary);
            return {
              ...artist,
              totalScore: summary.latestScore.totalScore || 0,
            };
          })
        )
      );

      setTrendingData(trending);
      setTableData(scores);

      console.log("Final combined table data:", scores);
    };

    getData();
  }, []);

  const handleEyeClick = (artist) => {
    console.log("Clicked eye icon for artist:", artist);
    setSelectedArtist(artist);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Trending Artists</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Total Score</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((artist) => (
              <tr key={artist.artistId} className="text-center">
                <td className="py-2 px-4 border-b">{artist.name}</td>
                <td className="py-2 px-4 border-b">{artist.totalScore}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEyeClick(artist)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FiEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedArtist && (
        <TrendingModal
          artist={selectedArtist}
          onClose={() => {
            console.log("Modal closed.");
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TrendingPage;
