import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtistSummary } from "../../Services/Api";
import ArtistProfileLeft from "../../Components/ArtistProfile/ArtistProfileLeft";
import ArtistProfileScores from "../../Components/ArtistProfile/ArtistProfileScores";
import Loader from '../../Components/Loader';

const ArtistProfilePage = () => {
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
  if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-4 md:p-8">
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <ArtistProfileLeft artist={artist} />
      </div>
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <ArtistProfileScores artist={artist} />
      </div>
    </div>
  );
};

export default ArtistProfilePage; 