import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import AppRouter from "./AppRouter";

// Create React 18 root
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <AppRouter />
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
