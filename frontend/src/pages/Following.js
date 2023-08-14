import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getFollowingBuzzes } from "../api/requests";
import { useBuzzContext } from "../hooks/useBuzzContext";
//TODO: Sort and fix import structure to follow a specific ruleset
// react, react-dom, react-router
// antd (the ui library)
// package/third-party imports, such as lodash.
// project alias imports
// relative imports

//update follower/following count
const Following = () => {
  const [error, setError] = useState("");
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();
  const { id } = useParams();
  const navigate = useNavigate();

  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  useEffect(() => {
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        dispatchBuzz({ type: "SET_BUZZ", payload: data });
        setError("");
      }
    };
    getFollowingBuzzes(response);
  }, [id, dispatchBuzz]);

  return (
    <div className="ml-64">
      {buzz && (
        <>
          <h1 className="mb-4 text-4xl mt-5 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Following
          </h1>
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

export default Following;
