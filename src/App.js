import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DrawResults from "./pages/DrawResults";
import Charities from "./pages/Charities";
import DrawHistory from "./pages/DrawHistory";
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import { getDashboard } from "./services/api";

function PrivateRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ token, children }) {
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const handleSetToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    getDashboard(token).then((data) => {
      if (data?.user) setUser(data.user);
      else handleSetToken(null);
    });
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute token={token}>
              <Login setToken={handleSetToken} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute token={token}>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token}>
              <Dashboard token={token} setToken={handleSetToken} />
            </PrivateRoute>
          }
        />
        <Route
          path="/charities"
          element={
            <PrivateRoute token={token}>
              <Charities token={token} user={user} setToken={handleSetToken} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute token={token}>
              <Profile token={token} setToken={handleSetToken} />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute token={token}>
              <Subscription
                token={token}
                user={user}
                setToken={handleSetToken}
                setUser={setUser}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/draw-results"
          element={
            <PrivateRoute token={token}>
              <DrawResults
                token={token}
                user={user}
                setToken={handleSetToken}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/draw-history"
          element={
            <PrivateRoute token={token}>
              <DrawHistory setToken={handleSetToken} user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}