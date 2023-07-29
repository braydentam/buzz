import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getByUser } from "../api/requests";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useProfileContext } from "../hooks/useProfileContext";
import { viewProfile } from "../api/requests";
import { follow } from "../api/requests";

const Profile = () => {
  const [error, setError] = useState("");
  const { buzz, dispatch: dispatchBuzz } = useBuzzContext();
  const { profile, dispatch } = useProfileContext();
  const [followStatus, setFollowStatus] = useState("");
  const { username } = useParams();
  const navigate = useNavigate();

  function isFollowed(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["id"]) {
      setFollowStatus("followed");
    }
  }

  useEffect(() => {
    console.log(profile);
    if (profile && profile.followers && profile.followers.length > 0) {
      profile.followers &&
        profile.followers.map((profile_id) => isFollowed(profile_id));
    }
  }, [dispatch, profile]);

  function handleClick(id) {
    navigate("/buzz/" + id);
  }

  //fix naming conventions (id should lead to id, not username)
  useEffect(() => {
    let reqData = {
      id: username,
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
  }, [username, dispatchBuzz]);

  useEffect(() => {
    let reqData = {
      username: username,
    };
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        dispatch({ type: "SET_PROFILE", payload: data });
        console.log(data);
      }
    };
    viewProfile(reqData, response);
  }, [dispatch, username]);

  const handleFollow = async () => {
    let reqData = {
      id: profile.user,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatch({ type: "SET_PROFILE", payload: data["profile"][0] });
        console.log(data["profile"][0]);
        setFollowStatus(data["action"]);
      }
    };
    await follow(reqData, response);
  };

  return (
    <div className="ml-64">
      {buzz && (
        <div>
          <div className="block flex items-center justify-center">
            <h1 className="mb-4 mt-5 pr-5 text-center font-extrabold leading-none tracking-tight text-gray-900 text-5xl">
              {username}'s Buzzes
            </h1>
            {followStatus === "followed"
              ? username !==
                  JSON.parse(localStorage.getItem("user"))["username"] && (
                  <button
                    onClick={(e) => {
                      handleFollow();
                    }}
                    className="bg-blue-500 mt-3 text-3xl hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Unfollow
                  </button>
                )
              : username !==
                  JSON.parse(localStorage.getItem("user"))["username"] && (
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
          {profile && (
            <div className="block flex items-center justify-center">
              <h4 class="pr-5 text-2xl font-bold dark:text-white">
                Followers: {profile.followers ? profile.followers.length : 0}
              </h4>
              <h4 class="text-2xl font-bold dark:text-white">
                Following: {profile.following ? profile.following.length : 0}
              </h4>
            </div>
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
  );
};

export default Profile;
