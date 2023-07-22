import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProfileContext } from "../hooks/useProfileContext";
import { getExplore, getProfile } from "../api/requests";
import CreateBuzz from "../components/CreateBuzz";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { buzz, dispatch } = useBuzzContext();
  const { dispatch: dispatchProfile } = useProfileContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user } = useAuthContext();
  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  useEffect(() => {
    setError("");
    const response = (data) => {
      if (data) {
        if (data["error"]) {
          setError(data["error"].message);
          dispatch({ type: "SET_BUZZ", payload: null });
        } else {
          dispatch({ type: "SET_BUZZ", payload: data });
        }
      }
    };
    if (user) {
      getExplore(response);
    }
  }, [dispatch, user]);

  useEffect(() => {
    setError("");
    const response = (data) => {
      if (data) {
        if (data["error"]) {
          setError(data["error"].message);
          dispatchProfile({ type: "SET_PROFILE", payload: null });
        } else {
          console.log(data);
          dispatchProfile({ type: "SET_PROFILE", payload: data });
        }
      }
    };
    if (user) {
      getProfile(response);
    }
  }, [dispatchProfile, user]);
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
          />
        ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Home;
