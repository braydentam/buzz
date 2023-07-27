import { React, useEffect, useState, useCallback } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getByUser } from "../api/requests";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useProfileContext } from "../hooks/useProfileContext";
import { follow } from "../api/requests";

const Profile = () => {
  const [error, setError] = useState("");
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();
  const { profile, dispatch } = useProfileContext();
  const [followStatus, setFollowStatus] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const isFollowed = useCallback((id) => {
    if (buzz && id === buzz[0].user_id) {
      setFollowStatus("followed");
    }
  }, [buzz])

  useEffect(() => {
    profile.following && profile.following.map((profile_id) => isFollowed(profile_id));
  }, [dispatch, profile.following, isFollowed]);

  function handleClick(id) {
    navigate("/buzz/" + id);
  }

  useEffect(() => {
    let reqData = {
      id: id,
    };
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        dispatchBuzz({ type: "SET_BUZZ", payload: data });
      }
    };
    getByUser(reqData, response);
  }, [id, dispatchBuzz]);

  const handleFollow = async () => {
    let reqData = {
      id: buzz[0].user_id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatch({ type: "SET_PROFILE", payload: data["profile"] });
        setFollowStatus(data["action"]);
      }
    };
    await follow(reqData, response);
  };

  return (
    <div className="ml-64">
      {buzz && (
        <div className="block flex items-center justify-center">
          <h1 className="mb-4 mt-5 pr-5 text-center font-extrabold leading-none tracking-tight text-gray-900 text-5xl">
            {id}'s Buzzes
          </h1>
          {followStatus === "followed" ? (
            <button
              onClick={(e) => {
                handleFollow();
              }}
              className="bg-blue-500 mt-3 text-3xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={(e) => {
                handleFollow();
              }}
              className="bg-blue-500 mt-3 text-3xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Follow
            </button>
          )}
        </div>
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
    //TODO: Make clicking your own buzzes lead to my buzzes and disable following yourself
  );
};

export default Profile;
