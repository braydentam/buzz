import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { getExplore } from "../api/requests";
import CreateBuzz from "../components/CreateBuzz";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { buzz, dispatch } = useBuzzContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user } = useAuthContext();
  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  useEffect(() => {
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
        dispatch({ type: "SET_BUZZ", payload: null });
      } else {
        dispatch({ type: "SET_BUZZ", payload: data });
      }
    };
    if (user) {
      getExplore(response);
    }
  }, [dispatch, user]);
  return (
    <div className="ml-64">
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

      <CreateBuzz />
    </div>
  );
};

export default Home;
