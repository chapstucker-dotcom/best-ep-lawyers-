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
import WageHour from "./pages/WageHour";
import PracticeAreaPage from "./pages/PracticeAreaPage";
import Guides from "./pages/Guides";
import GuideArticle from "./pages/GuideArticle";
import FeaturedBadge from "./pages/FeaturedBadge";

import { practiceAreaPages } from "./data/practiceAreaPages";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />

        {/* Personal Injury keeps its custom page design. */}
        <Route
          path="/el-paso-personal-injury-lawyers"
          element={<PersonalInjury />}
        />

        <Route path="/el-paso-wage-hour-lawyers" element={<WageHour />} />

        {/* All other practice-area routes come from one master data file. */}
        {practiceAreaPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={<PracticeAreaPage />}
          />
        ))}

        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:slug" element={<GuideArticle />} />
        <Route
          path="/featured-on-el-pasos-best-lawyers"
          element={<FeaturedBadge />}
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

