import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AuthContextProvider } from "./context/authContext";
import { BuzzContextProvider } from "./context/buzzContext";
import { ProfileContextProvider } from "./context/profileContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BuzzContextProvider>
        <ProfileContextProvider>
          <App />
        </ProfileContextProvider>
      </BuzzContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
