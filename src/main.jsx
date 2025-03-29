import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/app.css";
import "./assets/css/animation.css";
import App from "./router";
createRoot(document.getElementById("root")).render(<App />);
