import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Utility to decode JWT and check expiry
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // exp is in seconds
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = (newToken, userObj) => {
    setToken(newToken);
    setUser(userObj);
    localStorage.setItem("token", newToken);
    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // Keep user in sync with localStorage
    const handleStorage = () => {
      setToken(localStorage.getItem("token") || null);
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    setLoading(false);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Token expiry check on mount and whenever token changes
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
