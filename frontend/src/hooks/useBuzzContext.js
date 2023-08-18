import { useContext } from "react";
import { BuzzContext } from "../context/buzzContext";

export const useBuzzContext = () => {
  const context = useContext(BuzzContext);

  if (!context) {
    throw Error("Need BuzzContextProvider");
  }

  return context;
};
