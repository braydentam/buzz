import { React, useEffect, useState } from "react";
import Buzzes from "../components/Buzzes";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getByUser } from "../api/requests";

const Profile = () => {
  const [error, setError] = useState("");
  const [buzz, setBuzz] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  function handleClick(id) {
    navigate("/buzz/" + id);
  }
  useEffect(() => {
    let reqData = {
      id: id,
    };
    setError("");
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"].message);
      } else {
        setBuzz(data);
      }
    };
    getByUser(reqData, response);
  }, [id]);
  
  return (
    <div className="ml-64">
      {buzz && (
        <h1 className="mb-4 text-3xl mt-5 text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl">
          {id}'s Buzzes
        </h1>
      )}
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

export default Profile;
