import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchDraftableArtists,
  fetchUserTeam,
  updateDraft,
} from "../../Services/Api";
import Loader from "../../Components/Loader";
import Modal from "../../Components/Client/Modal";

const RedraftFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, currentMemberId } = location.state || {};

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(artists.length / itemsPerPage);
  const paginatedArtists = artists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const res = await fetchDraftableArtists(category);
        setArtists(res);
      } catch (err) {
        setModalMessage("❌ Failed to load artists.");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    loadArtists();
  }, [category]);

  const handleReplace = async (newArtistId) => {
    setIsReplacing(true);
    try {
      const team = await fetchUserTeam();
      const members = team.teamMembers || [];

      const updatedDraft = members.map((member) =>
        member._id === currentMemberId
          ? newArtistId
          : member.artistId._id || member.artistId
      );
      const res = await updateDraft(updatedDraft, team.userTeam.teamName);
      console.log("Replace Response:", res);

      setModalMessage(res.message || "✅ Artist replaced successfully!");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/my-team");
      }, 2000);
    } catch (error) {
      console.error("Replace Error:", error.response);
      setModalMessage(
        error.response?.data?.error || "❌ Failed to replace artist."
      );
      setShowModal(true);
    } finally {
      setIsReplacing(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 text-white max-w-7xl mx-auto relative">
      {/* Loader during Replace */}
      {isReplacing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Redraft Flow</h1>
          <p className="text-sm text-gray-400">
            Replace your artist from the{" "}
            <strong className="capitalize">{category}</strong> category
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 
             bg-gradient-to-r from-[#794AFE] to-[#B292FF] 
             text-white rounded-full 
             hover:from-pink-600 hover:to-purple-600 
             transition duration-300 ease-in-out"
          onClick={() => navigate("/my-team")}
        >
          Cancel
        </button>
      </div>

      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#7B4DFE] via-[#7B4DFE] to-[#B393FE] rounded-xl p-4 mb-8 text-center text-white text-lg font-semibold">
        Draft From Category: <span className="capitalize">{category}</span>
      </div>

      {/* Artist Cards or Loader */}
      {loading ? (
        <Loader />
      ) : artists.length === 0 ? (
        <div className="text-center text-gray-400">
          No artists found in this category.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {paginatedArtists.map((artist) => (
              <div
                key={artist._id}
                className="bg-[#1f223e] border border-[#353751] rounded-xl p-4 flex flex-col justify-between h-full hover:scale-105 transition-transform"
              >
                <div className="mb-4 border-b border-white pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-md font-semibold">{artist.name}</h2>
                    <span className="bg-purple-600 text-xs px-2 py-1 rounded-full capitalize">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-yellow-400">
                    <img
                      src="/img/game-icons_two-coins.png"
                      alt="coin"
                      className="w-6 h-6 object-contain"
                    />
                    <span>{artist.totalScore?.toLocaleString()} pts</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="bg-[#2a2d48] p-3 rounded-full flex justify-between items-center text-sm">
                    <span>Drafting: {artist.draftingPercentage || 0}%</span>
                    <span>
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
                      ) : null}
                    </span>
                  </div>
                </div>

                <button
                  className="mt-auto bg-[#865DFF] hover:bg-[#7a52e5] transition-colors text-white py-2 rounded-full w-full"
                  onClick={() => handleReplace(artist._id)}
                >
                  Replace
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 flex-wrap gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    currentPage === idx + 1
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-gray-300 text-black hover:bg-purple-400 hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RedraftFlow;
