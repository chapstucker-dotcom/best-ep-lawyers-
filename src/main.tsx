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

if (
  root.dataset.ssr === "personal-injury" &&
  window.location.pathname.replace(/\/+$/, "") ===
    "/el-paso-personal-injury-lawyers"
) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
