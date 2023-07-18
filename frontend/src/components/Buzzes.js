import { React, useState } from "react";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { like, follow } from "../api/requests";

const Buzzes = (buzz) => {
  const b = buzz.buzz;
  const { dispatch } = useBuzzContext();
  const [error, setError] = useState("");

  const handleLike = async () => {
    let reqData = {
      id: b._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatch({ type: "SET_BUZZ", payload: data });
      }
    };
    await like(reqData, response);
    //TODO: Change UI when liked
  };

  const handleFollow = async () => {
    let reqData = {
      id: b._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatch({ type: "SET_BUZZ", payload: data });
      }
    };
    await follow(reqData, response);
    //TODO: Change UI when liked
  };

  return (
    <div className="" onClick={buzz.onClick}>
      <div className="block m-10 rounded-md bg-white p-6 hover:bg-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <button
          onClick={(e) => {
            handleFollow();
            e.stopPropagation();
          }}
        >
          <div className="flex">
            <div className="text-lg text-xl font-medium leading-tight text-neutral-800">
              {b.name}
              <span className="text-gray-400 pr-3"> @{b.username}</span>
            </div>
            <span className="ml-15 flex items-center px-2 rounded-lg outline outline-offset-0 text-blue-500 outline-blue-500 hover:drop-shadow-lg hover:bg-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="blue"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <div className="text-lg ml-15">Follow</div>
              {/* TODO: Make change follow button UI when followed */}
            </span>
          </div>
        </button>

        <p className="mb-4 text-base text-neutral-600">{b.message}</p>
        <button
          onClick={(e) => {
            handleLike();
            e.stopPropagation();
          }}
        >
          <div className="flex p-1 rounded-lg items-center outline outline-offset-0 outline-red-500 bg-white hover:drop-shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="red"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <div className="text-red-500 text-lg ml-15">
              {b.likes ? b.likes.length : 0}
            </div>
          </div>
        </button>
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
