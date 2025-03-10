import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/components/dashboard/Dashboard";
import JobsPage from "./jobs";
import NewJobPage from "./jobs/new";
import LoginPage from "./login";
import ReportsPage from "./reports";
import ProductsPage from "./products";
import StaffPage from "./staff";
import SettingsPage from "./settings";
import { useEffect, useState } from "react";

export default function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/new" element={<NewJobPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Add Tempo routes if needed */}
      {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
    </Routes>
  );
}
