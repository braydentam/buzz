import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Buzzes from "../components/Buzzes";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { getById } from "../api/requests";
import { like, getComments, deleteBuzz } from "../api/requests";
import { useNavigate } from "react-router-dom";
import CreateComment from "../components/CreateComment";
//TODO: fix naming for comments vs comment

//TODO: order functions and variables
const Buzz = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [buzz, setBuzz] = useState(null);
  const { comment, dispatch: dispatchBuzz } = useBuzzContext();
  const [likeStatus, setLikeStatus] = useState("");
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile/" + buzz.username);
  };

  const handleDelete = async () => {
    let reqData = {
      deleteID: buzz._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        navigate("/");
        setError("");
      }
    };
    await deleteBuzz(reqData, response);
  };

  function handleClick(id) {
    navigate("/buzz/" + id);
  }

  function findBuzz(array, id) {
    return array.find((element) => {
      return element._id === id;
    });
  }

  const handleLike = async () => {
    let reqData = {
      likeID: buzz._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        setBuzz(findBuzz(data["buzz"], id));
        setLikeStatus(data["action"]);
        //finds the "parent" buzz being displayed from a list of buzzes and sets the "parent" buzz to be displayed and liked status
        setError("");
      }
    };
    await like(reqData, response);
  };

  useEffect(() => {
    let reqData = {
      id: id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        setBuzz(data);
        //sets the "parent" buzz being displayed
        setError("");
      }
    };
    getById(reqData, response);
  }, [id]);

  useEffect(() => {
    let reqData = {
      parentID: id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatchBuzz({ type: "SET_COMMENT", payload: data });
        setError("");
      }
    };
    getComments(reqData, response);
  }, [id, dispatchBuzz]);

  function isLiked(id) {
    if (id === JSON.parse(localStorage.getItem("user"))["id"]) {
      setLikeStatus("liked");
    }
  }

  useEffect(() => {
    buzz && buzz.likes && buzz.likes.map((like_id) => isLiked(like_id));
  }, [buzz]);
  //Sets the liked status, which shows the liked logo if a post is liked

  return (
    <div>
      {buzz && (
        <div className="ml-64">
          <div className="block m-10 rounded-md bg-white p-6 pb-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <button
              onClick={(e) => {
                handleProfile();
                e.stopPropagation();
              }}
            >
              <span className="">
                <div className="pr-1 text-lg text-xl font-medium leading-tight text-neutral-800 hover:text-blue-500 hover:underline">
                  {buzz.name}
                </div>
              </span>
            </button>
            <span className="text-lg text-xl font-medium leading-tight text-gray-400">
              {" "}
              @{buzz.username}
            </span>
            <p className="mb-4 text-base text-neutral-600">{buzz.message}</p>
            <div className="flex items-start">
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
                    {buzz.likes ? buzz.likes.length : 0}
                  </div>
                </div>
              </button>
              <CreateComment buzz={buzz} />
              {buzz.userID ===
                JSON.parse(localStorage.getItem("user"))["id"] && (
                <button
                  className="flex flex p-1 rounded-lg items-center outline outline-offset-0 bg-red-500 hover:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
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
                  <div className="text-black text-lg text-white ml-15">
                    Delete
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="ml-64">
        {comment != null && comment.length > 0 && (
          <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Comments
          </h1>
        )}
        {comment != null &&
          comment.map((buzz) => (
            <Buzzes
              key={buzz._id}
              onClick={() => {
                handleClick(buzz._id);
              }}
              buzz={buzz}
              isComment={true}
            />
          ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Buzz;
