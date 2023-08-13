import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getByUser } from "../api/requests";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useProfileContext } from "../hooks/useProfileContext";
import { viewProfile } from "../api/requests";
import { follow } from "../api/requests";
import UserModal from "../components/UserModal";

const Profile = () => {
  const [error, setError] = useState("");
  const { buzz, comment, liked, dispatch } = useBuzzContext();
  const { profile, dispatch: dispatchProfile } = useProfileContext();
  const [title, setTitle] = useState("Posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");
  const { username } = useParams();
  const navigate = useNavigate();

  function isFollowed(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["username"]) {
      setFollowStatus("followed");
    }
  }

  useEffect(() => {
    if (profile && profile.followers && profile.followers.length > 0) {
      profile.followers &&
        profile.followers.map((profile_id) => isFollowed(profile_id));
    }
  }, [dispatchProfile, profile]);

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
        dispatch({ type: "SET_BUZZ", payload: data["buzz"] });
        dispatch({ type: "SET_COMMENT", payload: data["comments"] });
        dispatch({ type: "SET_LIKED", payload: data["liked"] });
        setError("");
      }
    };
    getByUser(reqData, response);
  }, [username, dispatch]);

  useEffect(() => {
    let reqData = {
      username: username,
    };
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        dispatchProfile({ type: "SET_PROFILE", payload: data });
        setError("");
      }
    };
    viewProfile(reqData, response);
  }, [dispatchProfile, username]);

  const handleFollow = async () => {
    let reqData = {
      username: profile.username,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatchProfile({ type: "SET_PROFILE", payload: data["profile"] });
        setFollowStatus(data["action"]);
        setError("");
      }
    };
    console.log(reqData);
    await follow(reqData, response);
  };

  return (
    <div className="ml-64">
      {buzz && (
        <div>
          <div className="block flex items-center justify-center">
            <h1 className="mb-4 mt-5 pr-5 text-center font-extrabold leading-none tracking-tight text-gray-900 text-5xl">
              {username}'s {title}
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
          <div className="flex justify-center">
            <button
              onClick={() => {
                setTitle("Posts");
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              Posts
            </button>
            <button
              onClick={() => {
                setTitle("Comments");
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Comments
            </button>
            <button
              onClick={() => {
                setTitle("Liked Buzzes");
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Liked Buzzes
            </button>
          </div>
          {profile && (
            <div className="block flex items-center justify-center">
              <button onClick={() => setShowFollowers(true)}>
                <h4 className="pr-5 text-2xl font-bold dark:text-white">
                  <span className="hover:text-blue-500 hover:underline">
                    Followers:
                  </span>{" "}
                  {profile.followers ? profile.followers.length : 0}
                </h4>
              </button>
              <button onClick={() => setShowFollowing(true)}>
                <h4 className="text-2xl font-bold dark:text-white">
                  <span className="hover:text-blue-500 hover:underline">
                    Following:
                  </span>{" "}
                  {profile.following ? profile.following.length : 0}
                </h4>
              </button>
            </div>
          )}
        </div>
      )}
      {buzz &&
        title === "Posts" &&
        buzz.map((b) => {
          if (b.username === username)
            return (
              <Buzzes
                key={b._id}
                onClick={() => {
                  handleClick(b._id);
                }}
                buzz={b}
                isComment={false}
              />
            );
          return null;
        })}
      {comment &&
        title === "Comments" &&
        comment.map((b) => {
          if (b.username === username)
            return (
              <Buzzes
                key={b._id}
                onClick={() => {
                  handleClick(b._id);
                }}
                buzz={b}
                isComment={true}
              />
            );
          return null;
        })}
      {liked &&
        title === "Liked Buzzes" &&
        liked.map((b) => (
          <Buzzes
            key={b._id}
            onClick={() => {
              handleClick(b._id);
            }}
            buzz={b}
            isComment={false}
            isLike={true}
          />
        ))}
      {error && <div className="error">{error}</div>}
      <UserModal
        username={username}
        type="Following"
        showModal={showFollowing}
        setShowModal={setShowFollowing}
      />
      <UserModal
        username={username}
        type="Followers"
        showModal={showFollowers}
        setShowModal={setShowFollowers}
      />
    </div>
  );
};

export default Profile;
