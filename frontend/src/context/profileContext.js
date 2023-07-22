import { createContext, useReducer, useEffect } from "react";

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

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
      dispatch({ type: "SET_PROFILE", payload: profile });
    }
  }, []);

  console.log("ProfileContext state:", state);

  return (
    <ProfileContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};
