//Following page displays list of buzzes from followed users

import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBuzzContext } from "../hooks/useBuzzContext";
import Buzzes from "../components/Buzzes";
import { getFollowingBuzzes } from "../api/requests";

const Following = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();

  useEffect(() => {
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

  function navigateToBuzz(id) {
    navigate("/buzz/" + id);
  }

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

export default Following;
