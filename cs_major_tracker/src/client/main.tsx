import React from "react";
import ReactDOM from "react-dom/client";

// @ts-ignore
import App from "./App";
// @ts-ignore
import Tracker from "./Tracker";
// @ts-ignore
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
