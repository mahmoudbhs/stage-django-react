import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KpiPage from "./pages/KpiPage";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { KpiDataProvider } from "./context/KpiDataContext";
import RapportPage from "./components/RapportPage";
import AlertesPage from "./components/AlertesPage";
import Parametres from "./pages/Parametres";
import RolePage from "./pages/RolePage";

function App() {
  return (
    // Auth context must wrap everything using useContext(AuthContext)
    <AuthProvider>
      <FilterProvider>
        <KpiDataProvider>
          <Router>
            <AppRoutes />
          </Router>
        </KpiDataProvider>
      </FilterProvider>
    </AuthProvider>
  );
}

// Toutes les routes privées ou publiques
function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute roles={["admin", "consultant"]}>
              <KpiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/kpi"
          element={
            <PrivateRoute roles={["admin", "consultant", "technicien"]}>
              <KpiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["admin", "technicien"]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/rapports"
          element={
            <PrivateRoute roles={["admin", "consultant", "technicien"]}>
              <RapportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/alertes"
          element={
            <PrivateRoute roles={["admin", "consultant", "technicien"]}>
              <AlertesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/parametres"
          element={
            <PrivateRoute roles={["admin"]}>
              <Parametres />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute roles={["admin"]}>
              <RolePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
