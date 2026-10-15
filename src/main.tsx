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
};

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";

if (ssrRoutes[pathname] && root.dataset.ssr === ssrRoutes[pathname]) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
