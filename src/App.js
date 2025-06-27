import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminDashboard from "./Pages/AdminDashboard";
import AddArtistCSV from "./Pages/AddArtistCSV";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Layout from "./Components/Layout";
import ClientIndex from "./Pages/ClientSide/ClientIndex";
import ClientLayout from "./Components/Client/ClientLayout";
import ProfileIndex from "./Pages/ClientSide/ProfileIndex";
import MyTeam from "./Pages/ClientSide/MyTeam";
import ArtistProfilePage from "./Pages/ClientSide/ArtistProfilePage";
import CreateTeam from "./Pages/ClientSide/CreateTeam";
import GlobalLeaderboard from "./Pages/Leaderboard/GlobalLeaderboard";
import FriendsList from "./Pages/Leaderboard/FriendsList";
import FriendLeaderboardView from "./Pages/Leaderboard/FriendLeaderboardView";
import CreateFriendLeaderboard from "./Pages/Friends/CreateFriendLeaderboard";

function AppRoutes() {
  const { user, token, loading } = useAuth();
  const role = user?.role;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!token || !role) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (role === "admin") {
    return (
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="add-artist-csv" element={<AddArtistCSV />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Default: user
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<ClientLayout />}>
          <Route index element={<ClientIndex />} />
          <Route path="profile" element={<ProfileIndex />} />
          <Route path="my-team" element={<MyTeam />} />
          <Route path="artist/:id" element={<ArtistProfilePage />} />
          <Route path="create-team" element={<CreateTeam />} />
          <Route path="/leaderboard/global" element={<GlobalLeaderboard />} />
          <Route path="/leaderboard/friend" element={<FriendsList />} />
          <Route path="/leaderboard/friends/create" element={<CreateFriendLeaderboard />} />
          <Route path="/leaderboard/friend/:id" element={<FriendLeaderboardView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
