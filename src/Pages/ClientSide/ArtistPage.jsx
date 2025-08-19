import React, { useEffect, useState } from "react";
import { fetchUserStats } from "../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import DataTable from "../../Components/Client/DataTable";
const ArtistIndex = () => {
  
  return (
    <DataTable/>
  );
};

export default ArtistIndex;
