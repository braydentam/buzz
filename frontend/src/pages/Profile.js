//Profile page is used to show a profile;s buzzes, comments, liked buzzes, and following/followers as well as the option to follow

import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Buzzes from "../components/Buzzes";
import UserModal from "../components/UserModal";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useProfileContext } from "../hooks/useProfileContext";
import { getProfile, getByUsername, follow } from "../api/requests";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { buzz, comment, liked, dispatch: dispatchBuzz } = useBuzzContext();
  const { profile, dispatch: dispatchProfile } = useProfileContext();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("Posts");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");
  
  function isFollowed(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["username"]) {
      setFollowStatus("followed");
    }
  }

  useEffect(() => {
    if (profile && profile.followers && profile.followers.length > 0) {
        profile.followers.map((profile_id) => isFollowed(profile_id));
    }
    //checks if a user is following this profile
  }, [dispatchProfile, profile]);

  useEffect(() => {
    let reqData = {
      username: username,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
        dispatchBuzz({ type: "SET_COMMENT", payload: data["comments"] });
        dispatchBuzz({ type: "SET_LIKED", payload: data["liked"] });
        //displays the profile's buzzes, comments, and liked buzzes that has been clicked on
        setError("");
      }
    };
    getByUsername(reqData, response);
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
        dispatchProfile({ type: "SET_PROFILE", payload: data });
        //displays the profile that has been clicked on
        setError("");
      }
    };
    getProfile(reqData, response);
  }, [dispatchProfile, username]);

  function navigateToBuzz(id) {
    navigate("/buzz/" + id);
  }

  const handleFollow = async () => {
    let reqData = {
      followUsername: profile.username,
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
                  navigateToBuzz(b._id);
                }}
                buzz={b}
                isComment={false}
              />
            );
          return null;
        })}
      {comment &&
        title === "Comments" &&
        comment.map((commentBuzz) => {
          if (commentBuzz.username === username)
            return (
              <Buzzes
                key={commentBuzz._id}
                onClick={() => {
                  navigateToBuzz(commentBuzz._id);
                }}
                buzz={commentBuzz}
                isComment={true}
              />
            );
          return null;
        })}
      {liked &&
        title === "Liked Buzzes" &&
        liked.map((likedBuzz) => (
          <Buzzes
            key={likedBuzz._id}
            onClick={() => {
              navigateToBuzz(likedBuzz._id);
            }}
            buzz={likedBuzz}
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
