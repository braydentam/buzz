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

    case "DELETE_BUZZ":
      return {
        buzz: state.buzz.filter((b) => b._id !== action.payload._id),
      };
    case "DELETE_COMMENT":
      return {
        comment: state.comment.filter((c) => c._id !== action.payload._id),
      };
    case "DELETE_LIKED":
      return {
        liked: state.liked.filter((l) => l._id !== action.payload._id),
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
