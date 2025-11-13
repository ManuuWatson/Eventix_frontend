// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Import App, which now contains all providers and routing logic

// Create React 18 root
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* App handles all contexts and routing internally now */}
      <App /> 
    </BrowserRouter>
  </React.StrictMode>
);
