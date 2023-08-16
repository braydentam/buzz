import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { getExplore } from "../api/requests";
import CreateBuzz from "../components/CreateBuzz";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { logout } = useLogout();
  const { user } = useAuthContext();

  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  
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

  return (
    <div className="ml-64">
      {buzz && (
        <>
          <h1 className="mb-4 text-4xl mt-5 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
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
              handleClick(b._id);
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
