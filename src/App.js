import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AdminDashboard from "./Pages/AdminDashboard";
import Artists from "./Pages/Admin/Artists";
// import Artists from "./Pages/Admin/Artists";
import AddArtistCSV from "./Pages/AddArtistCSV";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Layout from "./Components/Layout";
import ClientIndex from "./Pages/ClientSide/ClientIndex";
import ClientLayout from "./Components/Client/ClientLayout";
import ProfileIndex from "./Pages/ClientSide/ProfileIndex";
import MyTeam from "./Pages/ClientSide/MyTeam";
import ArtistProfilePage from "./Pages/ClientSide/ArtistProfilePage";
import CreateTeam from "./Pages/ClientSide/CreateTeam/CreateTeam";
// import CreateTeam from "./Pages/ClientSide/CreateTeam/CreateTeam";
import GlobalLeaderboard from "./Pages/Leaderboard/GlobalLeaderboard";
import FriendsList from "./Pages/Leaderboard/FriendsList";
import FriendLeaderboardView from "./Pages/Leaderboard/FriendLeaderboardView";
import CreateFriendLeaderboard from "./Pages/Friends/CreateFriendLeaderboard";
import ComingSoonCard from "./Pages/Settings/Setting";
import Support from "./Pages/Support/Support";
import LegendPool from "./Pages/ClientSide/LegendPool";
import StandardPool from "./Pages/ClientSide/StandardPoll";
import BreakoutPool from "./Pages/ClientSide/BreakoutPool";
import TrendingPool from "./Pages/ClientSide/TrendingPool";
import UserTeam from "./Pages/ClientSide/UserTeam";
import AdminAllUsersPage from "./Pages/Admin/AllUsers";
import RedraftFlow from "./Pages/ClientSide/Redraft";
import ArtistIndex from "./Pages/ClientSide/ArtistPage";
import HowToPlayPage from "./Pages/ClientSide/HowToPlay/HowToPlay";
function AppRoutes() {
  const { user, token, loading } = useAuth();
  const role = user?.role;
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
            <Route path="admin/artists" element={<Artists />} />
            <Route path="all-users" element={<AdminAllUsersPage />} />
            <Route path="artist/:id" element={<ArtistProfilePage />} />
            <Route path="admin/artists" element={<Artists />} />
            <Route path="all-users" element={<AdminAllUsersPage />} />
            <Route path="artist/:id" element={<ArtistProfilePage />} />
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
          <Route path="profile-setting" element={<ProfileIndex />} />
          <Route path="artist" element={<ArtistIndex />} />
          <Route path="my-team" element={<MyTeam />} />
          <Route path="artist/:id" element={<ArtistProfilePage />} />
          <Route path="create-team" element={<CreateTeam />} />
          <Route path="/leaderboard/global" element={<GlobalLeaderboard />} />
          <Route path="/leaderboard/friend" element={<FriendsList />} />
          <Route path="/redraft" element={<RedraftFlow  />} />
          <Route path="/redraft" element={<RedraftFlow  />} />
          <Route path="/how-to-play" element={<HowToPlayPage  />} />
          <Route
            path="/leaderboard/friends/create"
            element={<CreateFriendLeaderboard />}
          />
          <Route
            path="/leaderboard/friend/:id"
            element={<FriendLeaderboardView />}
          />
          <Route path="/settings" element={<ComingSoonCard />} />
          <Route path="/support" element={<Support />} />
          <Route path="/legend-pool" element={<LegendPool />} />
          <Route path="/standard-pool" element={<StandardPool />} />
          <Route path="/breakout-pool" element={<BreakoutPool />} />
          <Route path="/trending-pool" element={<TrendingPool />} />
          <Route path="/user-team/:userId" element={<UserTeam />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
