import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../api/requests";

const SearchModal = (props) => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    let reqData = {
      query: props.query,
    };
    if (props.showModal) {
      const response = (data) => {
        if (data["error"]) {
          setError(data["error"]);
        } else {
          setUserList(data);
          //shows a list of users that satisfy a profile search query
          setError("");
        }
      };
      search(reqData, response);
    }
  }, [props, props.query]);

  const navigateToProfile = (name) => {
    props.setShowModal(false);
    navigate("/profile/" + name);
  };

  return (
    <div>
      {props.showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-1/2 bg-white outline-none focus:outline-none">
              <button
                type="button"
                onClick={() => {
                  props.setShowModal(false);
                }}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900">
                  Search Results
                </h3>
                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                  {userList &&
                    userList.map((user) => (
                      <li
                        key={user.username}
                        onClick={() => {
                          navigateToProfile(user.username);
                        }}
                        className="hover:text-blue-500 hover:underline"
                      >
                        {user.username}
                      </li>
                    ))}
                </ul>
                {userList && userList.length === 0 ? (
                  <div>No Results Found</div>
                ) : null}
                {error && <div className="error">{error}</div>}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default SearchModal;
