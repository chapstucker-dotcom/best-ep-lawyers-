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
import FamilyLaw from "./pages/FamilyLaw";
import DWI from "./pages/DWI";
import EstatePlanning from "./pages/EstatePlanning";
import EighteenWheelerAccident from "./pages/EighteenWheelerAccident";
import SemiTruckAccident from "./pages/SemiTruckAccident";
import PracticeAreaPage from "./pages/PracticeAreaPage";

import { practiceAreaPages } from "./data/practiceAreaPages";
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
          path="/el-paso-18-wheeler-accident-lawyer"
          element={<EighteenWheelerAccident />}
        />

        <Route
          path="/el-paso-semi-truck-accident-lawyer"
          element={<SemiTruckAccident />}
        />

        <Route
          path="/el-paso-criminal-defense-lawyers"
          element={<CriminalDefense />}
        />

        <Route
          path="/el-paso-immigration-lawyers"
          element={<Immigration />}
        />

        <Route
          path="/el-paso-family-lawyers"
          element={<FamilyLaw />}
        />

        <Route
          path="/el-paso-dwi-lawyers"
          element={<DWI />}
        />

        <Route
          path="/el-paso-estate-planning-lawyers"
          element={<EstatePlanning />}
        />

        {practiceAreaPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PracticeAreaPage />}
          />
        ))}

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