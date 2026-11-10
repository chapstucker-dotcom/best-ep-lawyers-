import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useRef } from "react";
import App from "./App.tsx";
import MetaPixelTracker from "./components/MetaPixelTracker";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousKey = useRef(location.key);

  useEffect(() => {
    if (previousKey.current === location.key) return;
    previousKey.current = location.key;

    if (location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      });
    } else if (navigationType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location, navigationType]);

  return null;
}
const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element not found");
}

const app = (
  <BrowserRouter>
    <ScrollToTop />
    <MetaPixelTracker />
    <Analytics />
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
  "/guides/uninsured-driver-accident-texas": "uninsured-driver-guide",
};

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

if (ssrRoutes[pathname] && root.dataset.ssr === ssrRoutes[pathname]) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
