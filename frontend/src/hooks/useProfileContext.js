import { useContext } from "react";
import { ProfileContext } from "../context/profileContext";

export const useProfileContext = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw Error("Need ProfileContextProvider");
  }

  return context;
};
