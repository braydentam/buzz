import { useAuthContext } from "./useAuthContext";
import { useBuzzContext } from "./useBuzzContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchBuzz } = useBuzzContext();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    dispatchBuzz({ type: "SET_BUZZ", payload: null });
  };

  return { logout };
};
