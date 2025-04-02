import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/app.css";
import "./assets/css/animation.css";
import App from "./router";
import { CookiesProvider } from "react-cookie";
createRoot(document.getElementById("root")).render(
  <CookiesProvider>
    <App />
  </CookiesProvider>
);
