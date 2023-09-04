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
          <h1 className="mb-4 text-2xl mt-5 ml-10 tracking-wide font-bold leading-none tracking-tight">
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
            isFollowing={true}
          />
        ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Following;
