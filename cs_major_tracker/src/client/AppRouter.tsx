import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.tsx";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Tracker from "./Tracker.tsx";
import Tutorial from "./Tutorial.tsx";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/tutorial" element={<Tutorial />} />

        {/* Protected Routes */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />

        <Route path="/home" element={<App />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

export default AppRouter;
