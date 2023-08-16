//BuzzContext manages the buzzes, comments, and liked buzzes that are being displayed on screen

import { createContext, useReducer } from "react";

export const BuzzContext = createContext();

export const buzzReducer = (state, action) => {
  switch (action.type) {
    case "SET_BUZZ":
      return {
        ...state,
        buzz: action.payload,
      };
    case "SET_COMMENT":
      return {
        ...state,
        comment: action.payload,
      };
    case "SET_LIKED":
      return {
        ...state,
        liked: action.payload,
      };
    case "CREATE_BUZZ":
      return {
        buzz: [action.payload, ...state.buzz],
      };
    case "CREATE_COMMENT":
      return {
        ...state,
        comment: [action.payload, ...state.comment],
      };
    case "CREATE_LIKED":
      return {
        ...state,
        liked: [action.payload, ...state.liked],
      };
    default:
      return state;
  }
};

export const BuzzContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(buzzReducer, {
    buzz: null,
    comment: null,
    liked: null,
  });

  return (
    <BuzzContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BuzzContext.Provider>
  );
};
