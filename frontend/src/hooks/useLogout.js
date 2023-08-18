import { useAuthContext } from "./useAuthContext";
import { useBuzzContext } from "./useBuzzContext";
import { useProfileContext } from "./useProfileContext";

export const useLogout = () => {
  const { dispatch: dispatchAuth } = useAuthContext();
  const { dispatch: dispatchBuzz } = useBuzzContext();
  const { dispatch: dispatchProfile } = useProfileContext();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    dispatchAuth({ type: "LOGOUT" });
    dispatchBuzz({ type: "SET_BUZZ", payload: null });
    dispatchProfile({ type: "SET_PROFILE", payload: null });
  };

  return { logout };
};
