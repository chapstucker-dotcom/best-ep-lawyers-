import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import MetaPixelTracker from "./components/MetaPixelTracker";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element not found");
}

const app = (
  <BrowserRouter>
    <MetaPixelTracker />
    <App />
  </BrowserRouter>
);

const ssrRoutes: Record<string, string> = {
  "/el-paso-personal-injury-lawyers": "personal-injury",
  "/el-paso-motorcycle-accident-lawyers": "motorcycle",
  "/el-paso-car-accident-lawyers": "car-accident",
  "/el-paso-truck-accident-lawyers": "truck-accident",
  "/el-paso-family-violence-lawyers": "family-violence",
  "/el-paso-landlord-tenant-lawyers": "landlord-tenant",
  "/el-paso-prenuptial-agreement-lawyers": "prenuptial-agreement",
  "/el-paso-sex-discrimination-lawyers": "sex-discrimination",
  "/el-paso-sideswipe-accident-lawyers": "sideswipe-accident",
  "/el-paso-t-bone-accident-lawyers": "t-bone-accident",
  "/el-paso-uninsured-motorist-lawyers": "uninsured-motorist",
  "/el-paso-wrong-way-accident-lawyers": "wrong-way-accident",
  "/el-paso-wage-hour-lawyers": "wage-hour",
  "/el-paso-sexual-harassment-lawyers": "sexual-harassment",
  "/el-paso-criminal-defense-lawyers": "criminal-defense",
  "/el-paso-immigration-lawyers": "immigration",
  "/el-paso-family-lawyers": "family",
  "/el-paso-employment-lawyers": "employment",
  "/el-paso-wrongful-termination-lawyers": "wrongful-termination",
  "/el-paso-wrongful-death-lawyers": "wrongful-death",
  "/el-paso-medical-malpractice-lawyers": "medical-malpractice",
  "/el-paso-slip-and-fall-lawyers": "slip-and-fall",
  "/el-paso-estate-planning-lawyers": "estate-planning",
  "/el-paso-retaliation-lawyers": "retaliation",
  "/el-paso-dwi-lawyers": "dwi",
};

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

if (ssrRoutes[pathname] && root.dataset.ssr === ssrRoutes[pathname]) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
