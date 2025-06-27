import React, { useState } from "react";
import { uploadArtistsCSV } from "../Services/Api";

const AddArtistCSV = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }
    setLoading(true);
    try {
      const res = await uploadArtistsCSV(file);
      setMessage("Artists uploaded successfully!");
      setFile(null);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Add Artists using CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="border p-2 rounded mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default AddArtistCSV;
