import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { getByUser } from "../api/requests";

const Posts = () => {
  const [error, setError] = useState("");
  const [buzz, setBuzz] = useState(null);
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("user"))["id"];
  console.log(id);
  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  useEffect(() => {
    let reqData = {
      id: id,
    };
    setError("");
    const response = (data) => {
      console.log(data);
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        console.log(data);
        setBuzz(data);
      }
    };
    getByUser(reqData, response);
  }, [id]);
  return (
    <div className="ml-64">
      <h1 className="mb-4 text-4xl mt-5 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        My Buzzes
      </h1>
      {buzz &&
        buzz.map((b) => (
          <Buzzes
            key={b._id}
            onClick={() => {
              handleClick(b._id);
            }}
            buzz={b}
          />
        ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Posts;
