//ProfileContext manages the profile that is currently being displayed on the page

import { createContext, useReducer } from "react";

export const ProfileContext = createContext();

export const profileReducer = (state, action) => {
  
  switch (action.type) {
    case "SET_PROFILE":
      return {
        profile: action.payload,
      };
    case "DELETE_PROFILE":
      return {
        profile: state.profile.filter((p) => p._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ProfileContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, {
    profile: null,
  });

  return (
    <ProfileContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
