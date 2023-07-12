import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./context/authContext";
import { BuzzContextProvider } from "./context/buzzContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BuzzContextProvider>
        <App />
      </BuzzContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
