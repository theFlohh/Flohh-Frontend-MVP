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

export const updateDraft = async (draftedArtists, teamName) => {
  const { data } = await API.put('/draft/drafts/update', { draftedArtists, teamName });
  return data;
};

export const fetchUserPointsBreakdown = async () => {
  const { data } = await API.get('/auth/user-points');
  return data;
};

export const fetchGlobalLeaderboard = async (timeframe = 'all') => {
  const { data } = await API.get(`/leaderboard/global?timeframe=${timeframe}`);
  return data.users;
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
  const { data } = await API.get('/auth/all-users'); // or the correct route path
  return data;
};


export default API;
