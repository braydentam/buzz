import React from "react";
import { useBuzzContext } from "../hooks/useBuzzContext";
import { createBuzz } from "../api/requests";

const CreateComment = (buzz) => {
  const { dispatch: dispatchBuzz } = useBuzzContext();
  const [showModal, setShowModal] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    let reqData = {
      message: message,
      comment: buzz["buzz"]._id,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatchBuzz({ type: "CREATE_COMMENT", payload: data });
        setShowModal(false);
        setError("");
      }
    };
    e.preventDefault();
    await createBuzz(reqData, response);
  };

  return (
    <div>
      <button
        className="h-10 mt-1 mx-5 text-sm block text-white  bg-[#8bc5bb] hover:bg-[#a3d0c8] hover:outline hover:outline-offset-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Comment
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-1/2 bg-[#171e1d] outline-none focus:outline-none">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent  hover:bg-[#3A3A3A] hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="text"
                      className="block mb-2 text-xl font-medium"
                    >
                      Your Comment
                    </label>
                    <textarea
                      type="text"
                      name="text"
                      id="text"
                      col="4"
                      onChange={(e) => setMessage(e.target.value)}
                      className="text-sm rounded-lg bg-[#2c3332] sm:text-xs placeholder-white block w-full p-2.5"
                      placeholder="Start writing..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-[#8bc5bb] hover:bg-[#a3d0c8] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Create Comment
                  </button>
                </form>
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

export default CreateComment;
