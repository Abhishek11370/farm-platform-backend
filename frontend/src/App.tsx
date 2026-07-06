import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes by role */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
            <Route path="/farmer" element={<FarmerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
            <Route path="/buyer" element={<BuyerDashboard />} />
          </Route>

          {/* Fallback mapping for home path depending on log state */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
