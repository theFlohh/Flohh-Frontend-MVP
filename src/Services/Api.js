import axios from 'axios';

// render
// const BASE_URL = 'https://floahh-backend.onrender.com/api';

// railway
// const BASE_URL = 'https://floahh-backend-production.up.railway.app/api';

// local
const BASE_URL = 'http://localhost:3002/api';


// Create an Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// === API Methods ===

export const fetchAllArtists = async () => {
  const { data } = await API.get('/artist/all');
  return data;
};

export const fetchArtistSummary = async (artistId) => {
  const { data } = await API.get(`/artist/${artistId}/summary`);
  return data;
};

export const uploadArtistsCSV = async (csvFile) => {
  const formData = new FormData();
  formData.append('file', csvFile);

  const { data } = await API.post('/artist/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const fetchUserTeam = async () => {
  const { data } = await API.get('/draft/user_draft');
  return data;
};

export const fetchArtistsByTier = async (tierName) => {
  const { data } = await API.get(`/tier/${tierName}`);
  return data;
};

export const fetchDraftableArtists = async (category) => {
  const { data } = await API.get(`/draft/artists?category=${category}`);
  return data;
};

export const submitDraft = async (draftedArtists, teamName) => {
  const { data } = await API.post('/draft/drafts', { draftedArtists, teamName });
  return data;
};

// export const updateDraft = async (draftedArtists, teamName, avatarFile) => {
//   const formData = new FormData();
//   formData.append("draftedArtists", JSON.stringify(draftedArtists));
//   formData.append("teamName", teamName);
  
//   if (avatarFile) {
//     formData.append("avatar", avatarFile);
//   }

//   const { data } = await API.put('/draft/drafts/update', formData, {
//     headers: {
//       "Content-Type": "multipart/form-data"
//     }
//   });
  
export const updateDraft = async (draftedArtists, teamName, avatarFile) => {
  const formData = new FormData();
  formData.append("draftedArtists", JSON.stringify(draftedArtists));
  // formData.append("teamName", teamName);
  if(teamName) return formData.append("teamName" ,teamName);
  
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const { data } = await API.put('/draft/drafts/update', formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  
  return data;
};

export const fetchUserStats = async () => {
  try {
    const token = localStorage.getItem("token"); // if using JWT auth
    const res = await axios.get("https://floahh-backend.onrender.com/api/user-stats", {
    // const res = await axios.get("http://localhost:3002/api/user-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data; // backend sends { success, data }
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
export const fetchUserPointsBreakdown = async () => {
  const { data } = await API.get('/auth/user-points');
  return data;
};

  

export const createFriendLeaderboard = async (name, members) => {
  const { data } = await API.post('/leaderboard/friend', { name, members });
  return data;
};

export const getMyFriendLeaderboards = async () => {
  const { data } = await API.get('/leaderboard/mine/friend');
  return data.leaderboards;
};

export const getFriendLeaderboardById = async (id) => {
  const { data } = await API.get(`/leaderboard/friend/${id}`);
  return data;
};

export const joinFriendLeaderboard = async (id) => {
  const { data } = await API.post(`/leaderboard/friend/${id}/join`);
  return data;
};

export const fetchMyFriendLeaderboards = async () => {
  const { data } = await API.get('/leaderboard/mine/friend');
  return data;
};

export const fetchAllUsers = async () => {
  try {
    const response = await API.get('/auth/all-users'); // adjust endpoint if different
    return response.data; // returns enriched users array
  } catch (error) {
    console.error('Failed to fetch all users:', error);
    throw error; // or return a fallback empty array []
  }
};

export const fetchAppOverview = async () => {
  try {
    const { data } = await API.get('/user-stats/overview');
    return data?.data || data;
  } catch (error) {
    console.error('Failed to fetch app overview:', error);
    throw error;
  }
};
// === User APIs ===

// ✅ Get Logged-in User Details
export const getUserDetails = async () => {
  try {
    const { data } = await API.get("/auth/me"); // <-- endpoint ko apke backend route ke hisaab se adjust karein
    return data;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
};

// ✅ Update Logged-in User
export const updateUser = async (formData) => {
  try {
    // Agar profile image upload ho rahi ho toh FormData ka use karein
    let payload = formData;
    let headers = {};

    if (formData instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const { data } = await API.put("/auth/update", payload, { headers });
    return data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};
export const fetchGlobalLeaderboard = async (entity = 'users', timeframe = 'all') => {
    const { data } = await API.get(`/leaderboard/global-leaderboard?entity=${entity}&timeframe=${timeframe}`);
    return entity === 'artists' ? data.artists : data.users;
}
export default API;
