import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);