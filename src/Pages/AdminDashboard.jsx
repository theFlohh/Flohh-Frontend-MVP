import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllArtists, fetchArtistSummary } from "../Services/Api";
import DataTable from "../Components/DataTable";
import ArtistModal from "../Components/ArtistModal";
import Layout from "../Components/Layout";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const getData = async () => {
    const result = await fetchAllArtists();
    setData(result);
  };

  const handleViewClick = async (artistId) => {
    const summary = await fetchArtistSummary(artistId);
    setSelectedArtist(summary);
    setModalOpen(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddArtistCSV = () => {
    navigate("/add-artist-csv");
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={handleAddArtistCSV}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white w-full sm:w-auto"
        >
          Add Artist using CSV
        </button>
      </header>

      <div className="overflow-x-auto">
        <DataTable data={data} onView={handleViewClick} />
      </div>

      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
        />
      )}
    </>
  );
};

export default AdminDashboard;
