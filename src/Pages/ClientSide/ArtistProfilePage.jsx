import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtistSummary } from "../../Services/Api";
import ArtistProfileLeft from "../../Components/ArtistProfile/ArtistProfileLeft";
import ArtistProfileScores from "../../Components/ArtistProfile/ArtistProfileScores";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
const ArtistProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getArtist = async () => {
      try {
        const data = await fetchArtistSummary(id);
        setArtist(data);
      } catch (err) {
        setError("Failed to load artist details");
      } finally {
        setLoading(false);
      }
    };
    getArtist();
  }, [id]);
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">
        {" "}
        {error}{" "}
      </div>
    );
  return (
    <div className="min-h-screen flex flex-col md:flex-col p-4 md:p-8">
      {" "}
      <div className="w-full flex flex-row gap-3 mb-4">
        {" "}
        <button
          className="w-10 h-10 flex p-4 border border-[#353751] bg-[#2a2d48] hover:scale-110 items-center justify-center rounded-full mb-2"
          onClick={() => navigate(-1)}
        >
          {" "}
          <img src="/img/arrow-back.png" className="w-4 h-4" alt="arrow" />{" "}
        </button>{" "}
        <div>
          {" "}
          <div className="text-2xl font-semibold text-white">
            {" "}
            Player Card{" "}
          </div>{" "}
          <div className="text-md text-gray-400 mb-2">
            {" "}
            Artist profiles & stats{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-0">
        {" "}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          {" "}
          <ArtistProfileLeft artist={artist} />{" "}
        </div>{" "}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {" "}
          <ArtistProfileScores artist={artist} />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ArtistProfilePage;
