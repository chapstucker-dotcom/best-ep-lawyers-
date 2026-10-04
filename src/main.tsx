import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import MetaPixelTracker from "./components/MetaPixelTracker";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MetaPixelTracker />
    <App />
  </BrowserRouter>
);
