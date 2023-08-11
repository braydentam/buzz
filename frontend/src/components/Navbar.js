import { React, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import SearchModal from "../components/SearchModal";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState("");
  var userURL = "";
  if (localStorage.getItem("user") != null) {
    userURL =
      "/profile/" + JSON.parse(localStorage.getItem("user"))["username"];
  }

  const handleClick = () => {
    logout();
  };

  return (
    <div>
      <div className="">
        <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
          <div className="flex items-center justify-center h-14 border-b">
            <div>
              <h1 className="text-5xl font-extrabold">Buzz</h1>
            </div>
          </div>
          {user && user.username && (
            <Fragment>
              <div className="flex items-center justify-center h-14 border-b">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                  Logged in as: {user.username}
                </h2>
              </div>
            </Fragment>
          )}

          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              {user && (
                <Fragment>
                  <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                      <div className="text-sm font-light tracking-wide text-gray-500">
                        Menu
                      </div>
                    </div>
                  </li>

                  <Link to="/">
                    <li>
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                          </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          Feed
                        </span>
                      </span>
                    </li>
                  </Link>
                  <Link to="/following">
                    <li>
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            ></path>
                          </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          Following
                        </span>
                        {/* <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                          1.2k
                        </span> */}
                      </span>
                    </li>
                  </Link>
                  <li>
                    <div className="pl-5 inline-flex justify-center items-center ">
                      <input
                        type="text"
                        id="small-input"
                        onChange={(e) => setKey(e.target.value)}
                        className="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Profile"
                      ></input>
                      <span className="ml-4">
                        <button
                          className="flex p-1 rounded-lg items-center outline outline-offset-0 bg-blue-400"
                          onClick={() => {
                            setShowModal(true);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </li>
                  <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                      <div className="text-sm font-light tracking-wide text-gray-500">
                        Profile
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to={userURL}>
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          My Buzzes
                        </span>
                      </span>
                    </Link>
                  </li>
                  {/* <li>
                    <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                      <span className="inline-flex justify-center items-center ml-4">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        Settings
                      </span>
                    </span>
                  </li> */}
                  <li>
                    <button
                      onClick={() => {
                        handleClick();
                      }}
                      className="w-full"
                    >
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                          </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          Logout
                        </span>
                      </span>
                    </button>
                  </li>
                  <SearchModal
                    props={key}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  <li className="px-5">
                    <div className="flex flex-row items-center h-8">
                      <div className="text-sm font-light tracking-wide text-gray-500">
                        New / Returning User
                      </div>
                    </div>
                  </li>
                  <Link to="/signup">
                    <li>
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4"></span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          Signup
                        </span>
                      </span>
                    </li>
                  </Link>
                  <Link to="/login">
                    <li>
                      <span className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4"></span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          Login
                        </span>
                      </span>
                    </li>
                  </Link>
                </Fragment>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
