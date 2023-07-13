import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../api/requests";

const Buzz = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [buzz, setBuzz] = useState(null);

  useEffect(() => {
    let reqData = {
      id: id,
    };
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        setBuzz(data);
      }
    };
    getById(reqData, response);
  }, [id]);

  return (
    <div>
      {buzz && (
        <div className="ml-64">
          <div className="block m-10 rounded-md bg-white p-6 pb-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800">
              {buzz.name}
              <span className="text-gray-400"> @{buzz.username}</span>
            </h5>
            <p className="mb-4 text-base text-neutral-600">{buzz.message}</p>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Buzz;
