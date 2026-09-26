import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import TestContainer from "./pages/TestContainer";
import ResultDashboard from "./pages/ResultDashboard";
import Certificate from "./pages/Certificate";

/**
 * Himoyalangan route — token bo'lmasa login'ga yuboradi.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Boshlang'ich splash */}
      <Route path="/" element={<Splash />} />

      {/* Ochiq sahifalar */}
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Himoyalangan sahifalar */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestContainer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:uuid"
        element={
          <ProtectedRoute>
            <ResultDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificate/:uuid"
        element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        }
      />

      {/* 404 → bosh sahifa */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}