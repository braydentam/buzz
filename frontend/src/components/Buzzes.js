import { React, useState, useEffect } from "react";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { useNavigate } from "react-router-dom";
import { like } from "../api/requests";

const Buzzes = (buzz) => {
  const b = buzz.buzz;
  const { dispatch: dispatchBuzz } = useBuzzContext();
  const [error, setError] = useState("");
  const [likeStatus, setLikeStatus] = useState("");
  const navigate = useNavigate();

  function isLiked(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["id"]) {
      setLikeStatus("liked");
    }
  }

  const handleProfile = () => {
    if (b.username === JSON.parse(localStorage.getItem("user"))["username"]) {
      navigate("/posts");
    } else {
      navigate("/profile/" + b.username);
    }
  };

  useEffect(() => {
    b.likes && b.likes.map((like_id) => isLiked(like_id));
  }, [dispatchBuzz, b.likes]);

  const handleLike = async () => {
    let reqData = {
      id: b._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatchBuzz({ type: "SET_BUZZ", payload: data["buzz"] });
        setLikeStatus(data["action"]);
      }
    };
    await like(reqData, response);
  };

  return (
    <div className="" onClick={buzz.onClick}>
      <div className="block m-10 rounded-md bg-white p-6 hover:bg-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div className="flex">
          <button
            onClick={(e) => {
              handleProfile();
              e.stopPropagation();
            }}
          >
            <span className="">
              <div className="pr-1 text-lg text-xl font-medium leading-tight text-neutral-800 hover:text-blue-500 hover:underline">
                {b.name}
              </div>
            </span>
          </button>
          <span className="text-lg text-xl font-medium leading-tight text-gray-400">
            {" "}
            @{b.username}
          </span>
        </div>
        <p className="mb-4 text-base text-neutral-600">{b.message}</p>
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
                  ? "flex p-1 rounded-lg items-center outline outline-offset-0 outline-red-500 bg-red-500 hover:drop-shadow-lg"
                  : "flex p-1 rounded-lg items-center outline outline-offset-0 outline-red-500 bg-white hover:drop-shadow-lg"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={likeStatus === "liked" ? "white" : "red"}
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
                    ? "text-white text-lg ml-15"
                    : "text-red-500 text-lg ml-15"
                }
              >
                {b.likes ? b.likes.length : 0}
              </div>
            </div>
          </button>
          <div className="flex flex ml-5 p-1 rounded-lg items-center outline outline-offset-0 outline-black-500">
            <svg
              class="svg-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth=".5"
              stroke="black"
              className="w-7 h-6 mt-1"
            >
              <path d="M17.211,3.39H2.788c-0.22,0-0.4,0.18-0.4,0.4v9.614c0,0.221,0.181,0.402,0.4,0.402h3.206v2.402c0,0.363,0.429,0.533,0.683,0.285l2.72-2.688h7.814c0.221,0,0.401-0.182,0.401-0.402V3.79C17.612,3.569,17.432,3.39,17.211,3.39M16.811,13.004H9.232c-0.106,0-0.206,0.043-0.282,0.117L6.795,15.25v-1.846c0-0.219-0.18-0.4-0.401-0.4H3.189V4.19h13.622V13.004z"></path>
            </svg>
            <div className="text-black text-lg ml-15">{b.commentCount}</div>
          </div>
        </div>
      </div>
      {error && (
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong class="font-bold">Error </strong>
          <span class="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Buzzes;
