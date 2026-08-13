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
import Immigration from "./pages/Immigration";
import FamilyLaw from "./pages/FamilyLaw";
import DWI from "./pages/DWI";
import EstatePlanning from "./pages/EstatePlanning";
import EighteenWheelerAccident from "./pages/EighteenWheelerAccident";
import SemiTruckAccident from "./pages/SemiTruckAccident";
import SlipAndFall from "./pages/SlipAndFall";
import MedicalMalpractice from "./pages/MedicalMalpractice";
import BrainInjury from "./pages/BrainInjury";
import ConstructionAccident from "./pages/ConstructionAccident";
import DogBite from "./pages/DogBite";
import TraumaticBrainInjury from "./pages/TraumaticBrainInjury";
import CarAccident from "./pages/CarAccident";
import MotorcycleAccident from "./pages/MotorcycleAccident";
import TruckAccidentLawyers from "./pages/TruckAccidentLawyers";
import WrongfulDeath from "./pages/WrongfulDeath";
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

        <Route
          path="/el-paso-slip-and-fall-lawyers"
          element={<SlipAndFall />}
        />

        <Route
          path="/el-paso-medical-malpractice-lawyers"
          element={<MedicalMalpractice />}
        />

        <Route
          path="/el-paso-brain-injury-lawyers"
          element={<BrainInjury />}
        />

        <Route
          path="/el-paso-construction-accident-lawyers"
          element={<ConstructionAccident />}
        />

        <Route
          path="/el-paso-dog-bite-lawyers"
          element={<DogBite />}
        />

        <Route
          path="/el-paso-traumatic-brain-injury-lawyers"
          element={<TraumaticBrainInjury />}
        />

        <Route
          path="/el-paso-car-accident-lawyers"
          element={<CarAccident />}
        />

        <Route
          path="/el-paso-truck-accident-lawyers"
          element={<TruckAccidentLawyers />}
        />

        <Route
          path="/el-paso-motorcycle-accident-lawyers"
          element={<MotorcycleAccident />}
        />

        <Route
          path="/el-paso-wrongful-death-lawyers"
          element={<WrongfulDeath />}
        />

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
