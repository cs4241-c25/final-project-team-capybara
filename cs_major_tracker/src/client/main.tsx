import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Tracker from "./Tracker";
import Tutorial from "./Tutorial";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <Router>
          <Routes>
              <Route path="/home" element={<App />} />
              <Route path="*" element={<App />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/tutorial" element={<Tutorial />} />
          </Routes>
      </Router>
  </React.StrictMode>,
);
