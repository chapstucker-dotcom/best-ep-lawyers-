import { Route, Routes } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AttorneyDetails from "./pages/AttorneyDetails";
import PersonalInjury from "./pages/PersonalInjury";
import CriminalDefense from "./pages/CriminalDefense";
import Immigration from "./pages/Immigration";

import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/el-paso-personal-injury-lawyers"
          element={<PersonalInjury />}
        />

        <Route
          path="/el-paso-criminal-defense-lawyers"
          element={<CriminalDefense />}
        />

        <Route
          path="/el-paso-immigration-lawyers"
          element={<Immigration />}
        />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/attorney/:id" element={<AttorneyDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}