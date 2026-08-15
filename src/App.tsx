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
import WorkplaceDiscrimination from "./pages/WorkplaceDiscrimination";
import CriminalDefense from "./pages/CriminalDefense";
import Immigration from "./pages/Immigration";
import CarAccidentLawyers from "./pages/CarAccidentLawyers";
import DogBite from "./pages/DogBite";
import SlipAndFall from "./pages/SlipAndFall";
import TruckAccidentLawyers from "./pages/TruckAccidentLawyers";
import BicycleAccident from "./pages/BicycleAccident";
import WrongfulTermination from "./pages/WrongfulTermination";
import EmploymentLaw from "./pages/EmploymentLaw";
import AgeDiscrimination from "./pages/AgeDiscrimination";
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
        <Route path="/el-paso-workplace-discrimination-lawyers" element={<WorkplaceDiscrimination />} />

        <Route path="/el-paso-criminal-defense-lawyers" element={<CriminalDefense />} />
        <Route path="/el-paso-immigration-lawyers" element={<Immigration />} />
        <Route path="/el-paso-car-accident-lawyers" element={<CarAccidentLawyers />} />
        <Route path="/el-paso-dog-bite-lawyers" element={<DogBite />} />
        <Route path="/el-paso-slip-and-fall-lawyers" element={<SlipAndFall />} />
        <Route path="/el-paso-truck-accident-lawyers" element={<TruckAccidentLawyers />} />
        <Route path="/el-paso-bicycle-accident-lawyers" element={<BicycleAccident />} />
        <Route path="/el-paso-wrongful-termination-lawyers" element={<WrongfulTermination />} />
        <Route path="/el-paso-employment-lawyers" element={<EmploymentLaw />} />
        <Route path="/el-paso-age-discrimination-lawyers" element={<AgeDiscrimination />} />

        {/* All other practice-area routes come from one master data file. */}
        {practiceAreaPages.filter((page) => !["/el-paso-dog-bite-lawyers", "/el-paso-slip-and-fall-lawyers", "/el-paso-truck-accident-lawyers", "/el-paso-bicycle-accident-lawyers", "/el-paso-wrongful-termination-lawyers", "/el-paso-employment-lawyers"].includes(page.path)).map((page) => (
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











