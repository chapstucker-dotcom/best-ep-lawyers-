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
import FirmProfilePage from "./pages/FirmProfilePage";

import PersonalInjury from "./pages/PersonalInjury";
import WageHour from "./pages/WageHour";
import WorkplaceDiscrimination from "./pages/WorkplaceDiscrimination";
import CriminalDefense from "./pages/CriminalDefense";
import Immigration from "./pages/Immigration";
import CarAccidentLawyers from "./pages/CarAccidentLawyers";
import DogBite from "./pages/DogBite";
import SlipAndFall from "./pages/SlipAndFall";
import TruckAccidentLawyers from "./pages/TruckAccidentLawyers";
import MotorcycleAccident from "./pages/MotorcycleAccident";
import BicycleAccident from "./pages/BicycleAccident";
import WrongfulTermination from "./pages/WrongfulTermination";
import EmploymentLaw from "./pages/EmploymentLaw";
import AgeDiscrimination from "./pages/AgeDiscrimination";
import SexDiscrimination from "./pages/SexDiscrimination";
import WrongfulDeath from "./pages/WrongfulDeath";
import OvertimePayDisputes from "./pages/OvertimePayDisputes";
import PracticeAreaPage from "./pages/PracticeAreaPage";
import WorkersCompensation from "./pages/WorkersCompensation";
import BrainInjury from "./pages/BrainInjury";
import ConstructionAccident from "./pages/ConstructionAccident";
import MedicalMalpractice from "./pages/MedicalMalpractice";
import PremisesLiability from "./pages/PremisesLiability";
import ProductLiability from "./pages/ProductLiability";
import PedestrianAccident from "./pages/PedestrianAccident";
import RideshareAccident from "./pages/RideshareAccident";
import UninsuredMotorist from "./pages/UninsuredMotorist";
import DrunkDrivingAccident from "./pages/DrunkDrivingAccident";
import DistractedDrivingAccident from "./pages/DistractedDrivingAccident";
import RearEndAccident from "./pages/RearEndAccident";
import HitAndRunAccident from "./pages/HitAndRunAccident";
import IntersectionAccident from "./pages/IntersectionAccident";
import HighwayAccident from "./pages/HighwayAccident";
import MultiVehicleAccident from "./pages/MultiVehicleAccident";
import HeadOnCollision from "./pages/HeadOnCollision";
import WrongWayAccident from "./pages/WrongWayAccident";
import TBoneAccident from "./pages/TBoneAccident";
import RolloverAccident from "./pages/RolloverAccident";
import SideswipeAccident from "./pages/SideswipeAccident";
import LaneChangeAccident from "./pages/LaneChangeAccident";
import MergingAccident from "./pages/MergingAccident";
import FailureToYieldAccident from "./pages/FailureToYieldAccident";
import RedLightAccident from "./pages/RedLightAccident";

import Guides from "./pages/Guides";
import GuideArticle from "./pages/GuideArticle";
import FeaturedBadge from "./pages/FeaturedBadge";

import { practiceAreaPages } from "./data/practiceAreaPages";
import { AuthProvider } from "./contexts/AuthContext";

const customPracticeAreaPaths = [
  "/el-paso-personal-injury-lawyers",
  "/el-paso-wage-hour-lawyers",
  "/el-paso-workplace-discrimination-lawyers",
  "/el-paso-criminal-defense-lawyers",
  "/el-paso-immigration-lawyers",
  "/el-paso-car-accident-lawyers",
  "/el-paso-dog-bite-lawyers",
  "/el-paso-slip-and-fall-lawyers",
  "/el-paso-truck-accident-lawyers",
  "/el-paso-motorcycle-accident-lawyers",
  "/el-paso-bicycle-accident-lawyers",
  "/el-paso-wrongful-termination-lawyers",
  "/el-paso-employment-lawyers",
  "/el-paso-age-discrimination-lawyers",
  "/el-paso-sex-discrimination-lawyers",
  "/el-paso-wrongful-death-lawyers",
  "/el-paso-overtime-pay-disputes-lawyers",
  "/el-paso-workers-compensation-lawyers",
  "/el-paso-brain-injury-lawyers",
  "/el-paso-construction-accident-lawyers",
  "/el-paso-medical-malpractice-lawyers",
  "/el-paso-premises-liability-lawyers",
  "/el-paso-product-liability-lawyers",
  "/el-paso-pedestrian-accident-lawyers",
  "/el-paso-rideshare-accident-lawyers",
  "/el-paso-uninsured-motorist-lawyers",
  "/el-paso-drunk-driving-accident-lawyers",
  "/el-paso-distracted-driving-accident-lawyers",
  "/el-paso-rear-end-accident-lawyers",
  "/el-paso-hit-and-run-accident-lawyers",
  "/el-paso-intersection-accident-lawyers",
  "/el-paso-highway-accident-lawyers",
  "/el-paso-multi-vehicle-accident-lawyers",
  "/el-paso-head-on-collision-lawyers",
  "/el-paso-wrong-way-accident-lawyers",
  "/el-paso-t-bone-accident-lawyers",
  "/el-paso-rollover-accident-lawyers",
  "/el-paso-sideswipe-accident-lawyers",
  "/el-paso-lane-change-accident-lawyers",
  "/el-paso-merging-accident-lawyers",
  "/el-paso-failure-to-yield-accident-lawyers",
  "/el-paso-red-light-accident-lawyers",
];


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/el-paso-personal-injury-lawyers"
          element={<PersonalInjury />}
        />
        <Route path="/el-paso-wage-hour-lawyers" element={<WageHour />} />
        <Route
          path="/el-paso-workplace-discrimination-lawyers"
          element={<WorkplaceDiscrimination />}
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
          path="/el-paso-car-accident-lawyers"
          element={<CarAccidentLawyers />}
        />
        <Route path="/el-paso-dog-bite-lawyers" element={<DogBite />} />
        <Route
          path="/el-paso-slip-and-fall-lawyers"
          element={<SlipAndFall />}
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
          path="/el-paso-bicycle-accident-lawyers"
          element={<BicycleAccident />}
        />
        <Route
          path="/el-paso-wrongful-termination-lawyers"
          element={<WrongfulTermination />}
        />
        <Route
          path="/el-paso-employment-lawyers"
          element={<EmploymentLaw />}
        />
        <Route
          path="/el-paso-age-discrimination-lawyers"
          element={<AgeDiscrimination />}
        />
        <Route
          path="/el-paso-sex-discrimination-lawyers"
          element={<SexDiscrimination />}
        />
        <Route
          path="/el-paso-wrongful-death-lawyers"
          element={<WrongfulDeath />}
        />
        <Route
          path="/el-paso-overtime-pay-disputes-lawyers"
          element={<OvertimePayDisputes />}
        />
        <Route
          path="/el-paso-workers-compensation-lawyers"
          element={<WorkersCompensation />}
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
          path="/el-paso-medical-malpractice-lawyers"
          element={<MedicalMalpractice />}
        />
        <Route
          path="/el-paso-premises-liability-lawyers"
          element={<PremisesLiability />}
        />
        <Route
          path="/el-paso-product-liability-lawyers"
          element={<ProductLiability />}
        />
        <Route
          path="/el-paso-pedestrian-accident-lawyers"
          element={<PedestrianAccident />}
        />
        <Route
          path="/el-paso-rideshare-accident-lawyers"
          element={<RideshareAccident />}
        />
        <Route
          path="/el-paso-uninsured-motorist-lawyers"
          element={<UninsuredMotorist />}
        />
        <Route
          path="/el-paso-drunk-driving-accident-lawyers"
          element={<DrunkDrivingAccident />}
        />
        <Route
          path="/el-paso-distracted-driving-accident-lawyers"
          element={<DistractedDrivingAccident />}
        />
        <Route
          path="/el-paso-rear-end-accident-lawyers"
          element={<RearEndAccident />}
        />
        <Route
          path="/el-paso-hit-and-run-accident-lawyers"
          element={<HitAndRunAccident />}
        />
        <Route
          path="/el-paso-intersection-accident-lawyers"
          element={<IntersectionAccident />}
        />
        <Route
          path="/el-paso-highway-accident-lawyers"
          element={<HighwayAccident />}
        />
        <Route
          path="/el-paso-multi-vehicle-accident-lawyers"
          element={<MultiVehicleAccident />}
        />
        <Route
          path="/el-paso-head-on-collision-lawyers"
          element={<HeadOnCollision />}
        />
        <Route
          path="/el-paso-wrong-way-accident-lawyers"
          element={<WrongWayAccident />}
        />
        <Route
          path="/el-paso-t-bone-accident-lawyers"
          element={<TBoneAccident />}
        />
        <Route
          path="/el-paso-rollover-accident-lawyers"
          element={<RolloverAccident />}
        />
            <Route
          path="/el-paso-sideswipe-accident-lawyers"
          element={<SideswipeAccident />}
        />
        <Route
          path="/el-paso-lane-change-accident-lawyers"
          element={<LaneChangeAccident />}
        />
        <Route
  path="/el-paso-failure-to-yield-accident-lawyers"
  element={<FailureToYieldAccident />}
/>
<Route
  path="/el-paso-red-light-accident-lawyers"
  element={<RedLightAccident />}
/>
        {practiceAreaPages
          .filter((page) => !customPracticeAreaPaths.includes(page.path))
          .map((page) => (
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
        <Route path="/firm/:id" element={<FirmProfilePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}