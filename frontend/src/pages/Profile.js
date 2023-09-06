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
          <div className="block flex items-center">
            <h1 className="mb-4 text-2xl mt-5 ml-10 tracking-wide font-bold leading-none tracking-tight">
              {username}'s {title}
            </h1>
            {followStatus === "followed"
              ? username !==
                  JSON.parse(localStorage.getItem("user"))["username"] && (
                  <button
                    onClick={(e) => {
                      handleFollow();
                    }}
                    className="bg-[#73b9ae] hover:bg-[#8bc5bb] font-bold ml-5 py-2 px-4 rounded-lg"
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
                    className="bg-[#73b9ae] hover:bg-[#8bc5bb] font-bold ml-5 py-2 px-4 rounded-lg"
                  >
                    Follow
                  </button>
                )}
          </div>
          <div className="flex ml-10 space-x-4">
            <button
              onClick={() => {
                setTitle("Posts");
              }}
              className="bg-[#434948] hover:bg-[#747978] font-bold py-2 px-4 rounded-lg"
            >
              Posts
            </button>
            <button
              onClick={() => {
                setTitle("Comments");
              }}
              className="bg-[#434948] hover:bg-[#747978] font-bold py-2 px-4 rounded-lg"
            >
              Comments
            </button>
            <button
              onClick={() => {
                setTitle("Liked Buzzes");
              }}
              className="bg-[#434948] hover:bg-[#747978] font-bold py-2 px-4 rounded-lg"
            >
              Liked Buzzes
            </button>
          </div>
          {profile && (
            <div className="block flex items-center">
              <button onClick={() => setShowFollowers(true)}>
                <h4 className="bg-[#434948] hover:bg-[#747978] py-2 px-4 rounded-lg mb-4 text-xl mt-5 ml-10 tracking-wide font-bold leading-none tracking-tight">
                  Followers: {profile.followers ? profile.followers.length : 0}
                </h4>
              </button>
              <button onClick={() => setShowFollowing(true)}>
                <h4 className="bg-[#434948] hover:bg-[#747978] py-2 px-4 rounded-lg mb-4 text-xl mt-5 ml-10 tracking-wide font-bold leading-none tracking-tight">
                  Following: {profile.following ? profile.following.length : 0}
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
