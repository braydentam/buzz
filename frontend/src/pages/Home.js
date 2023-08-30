import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buzzes from "../components/Buzzes";
import CreateBuzz from "../components/CreateBuzz";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { getExplore } from "../api/requests";

const Home = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();
  const [error, setError] = useState("");

  useEffect(
    () => {
      const response = (data) => {
        if (data) {
          if (data["error"]) {
            setError(data["error"].message);
            dispatchBuzz({ type: "SET_BUZZ", payload: null });
            if (
              data["error"].response &&
              data["error"].response.status === 401
            ) {
              logout();
            }
            //If a user fails authentication or JWT token expires, logout
          } else {
            dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
            setError("");
          }
        }
      };
      if (user) {
        getExplore(response);
      }
    },
    // eslint-disable-next-line
    [dispatchBuzz, user]
  );

  function navigateToBuzz(id) {
    navigate("/buzz/" + id);
  }
  
  return (
    <div className="ml-64">
      {buzz && (
        <>
          <h1 className="mb-4 text-2xl mt-5 ml-10 tracking-wide font-bold leading-none tracking-tight">
            Explore Buzzes
          </h1>
          <CreateBuzz />
        </>
      )}
      {buzz &&
        buzz.map((b) => (
          <Buzzes
            key={b._id}
            onClick={() => {
              navigateToBuzz(b._id);
            }}
            buzz={b}
            isComment={false}
          />
        ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Home;
