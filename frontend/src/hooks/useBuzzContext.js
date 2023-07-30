import { BuzzContext } from "../context/buzzContext";
import { useContext } from "react";

export const useBuzzContext = () => {
  const context = useContext(BuzzContext);

  if (!context) {
    throw Error("Need BuzzContextProvider");
  }

  return context;
};
