//Buzzes Component is used whenever there needs to be a single or list of buzzes displayed

import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { deleteBuzz, like } from "../api/requests";

const Buzzes = (props) => {
  const buzz = props.buzz;
  const navigate = useNavigate();
  const { dispatch: dispatchBuzz } = useBuzzContext();
  const [error, setError] = useState("");
  const [likeStatus, setLikeStatus] = useState("");

  function isLiked(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["id"]) {
      setLikeStatus("liked");
    }
  }
  //TODO: change this to track usernames instead

  useEffect(() => {
    buzz.likes && buzz.likes.map((like_id) => isLiked(like_id));
  }, [dispatchBuzz, buzz.likes]);
  //Sets the liked status, which shows the liked logo if a post is liked

  const handleProfile = () => {
    navigate("/profile/" + buzz.username);
  };

  const handleLike = async () => {
    let reqData = {
      likeID: buzz._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        if (!props.isFollowing) {
          dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
          if (!props.isCommentSection) {
            dispatchBuzz({ type: "SET_COMMENT", payload: data["comment"] });
          }
          if (!props.isLike) {
            dispatchBuzz({ type: "SET_LIKED", payload: data["liked"] });
          }
        }
        if (data["action"] === "unliked") {
          if (buzz && buzz.likes.length)
            buzz.likes.length = buzz.likes.length - 1;
        }
        if (data["action"] === "liked") {
          if (buzz && buzz.likes.length)
            buzz.likes.length = buzz.likes.length + 1;
          dispatchBuzz({ type: "SET_LIKED", payload: data["liked"] });
        }
        setLikeStatus(data["action"]);
        setError("");
      }
    };
    await like(reqData, response);
  };

  const handleDelete = async () => {
    let reqData = {
      deleteID: buzz._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        if (props.isComment) {
          dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
          dispatchBuzz({ type: "SET_COMMENT", payload: data["comments"] });
          dispatchBuzz({ type: "SET_LIKED", payload: data["comments"] });
        } else if (props.isLike) {
          dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
          dispatchBuzz({ type: "SET_LIKED", payload: data["liked"] });
          dispatchBuzz({ type: "SET_COMMENT", payload: data["comments"] });
        } else if (props.isCommentSection) {
          dispatchBuzz({ type: "DELETE_COMMENT", payload: buzz });
          dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
        } else {
          dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
          dispatchBuzz({ type: "SET_LIKED", payload: data["liked"] });
          dispatchBuzz({ type: "SET_COMMENT", payload: data["comments"] });
        }
        setError("");
      }
    };
    await deleteBuzz(reqData, response);
  };

  return (
    <div className="" onClick={props.onClick}>
      <div className="block m-10 rounded-md bg-[#2c3332] p-6 hover:bg-[#434948]">
        <div className="flex">
          <button
            onClick={(e) => {
              handleProfile();
              e.stopPropagation();
            }}
          >
            <span className="">
              <div className="pr-1 text-xl text-white font-medium leading-tight hover:text-blue-300 hover:underline">
                {buzz.name}
              </div>
            </span>
          </button>
          <span className="text-xl font-medium leading-tight text-gray-200">
            {" "}
            @{buzz.username}
          </span>
        </div>
        <p className="mb-5 mt-1 text-base">{buzz.message}</p>
        <div className="flex">
          <button
            onClick={(e) => {
              handleLike();
              e.stopPropagation();
            }}
          >
            <div
              className={
                likeStatus === "liked"
                  ? "flex rounded-lg items-center p-2 bg-[#8bc5bb] hover:drop-shadow-lg hover:outline hover:outline-offset-0"
                  : "flex rounded-lg items-center p-2 bg-white hover:drop-shadow-lg hover:outline hover:outline-offset-0 hover:outline-[#8bc5bb]"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={likeStatus === "liked" ? "white" : "#8bc5bb"}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <div
                className={
                  likeStatus === "liked"
                    ? "text-white text-lg ml-1"
                    : "text-[#8bc5bb] text-lg ml-1"
                }
              >
                {buzz.likes ? buzz.likes.length : 0}
              </div>
            </div>
          </button>
          <div className="flex ml-5 p-2 rounded-lg items-center bg-[#8bc5bb]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="white"
              className="svg-icon w-7 h-6 mt-1"
            >
              <path d="M17.211,3.39H2.788c-0.22,0-0.4,0.18-0.4,0.4v9.614c0,0.221,0.181,0.402,0.4,0.402h3.206v2.402c0,0.363,0.429,0.533,0.683,0.285l2.72-2.688h7.814c0.221,0,0.401-0.182,0.401-0.402V3.79C17.612,3.569,17.432,3.39,17.211,3.39M16.811,13.004H9.232c-0.106,0-0.206,0.043-0.282,0.117L6.795,15.25v-1.846c0-0.219-0.18-0.4-0.401-0.4H3.189V4.19h13.622V13.004z"></path>
            </svg>
            <div className="text-lg ml-15">{buzz.commentCount}</div>
          </div>
          {buzz.userID === JSON.parse(localStorage.getItem("user"))["id"] && (
            <button
              className="flex ml-5 p-2 rounded-lg items-center bg-red-500 hover:outline hover:outline-offset-0"
              onClick={(e) => {
                handleDelete();
                e.stopPropagation();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth=".5"
                stroke="white"
                className="svg-icon w-7 h-6 mt-1"
              >
                <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
              </svg>
              <div className="text-black text-lg text-white ml-15">Delete</div>
            </button>
          )}
        </div>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Buzzes;
