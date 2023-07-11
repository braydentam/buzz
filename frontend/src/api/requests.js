import axios from "axios";
import * as url from "./urls";
import { useState } from "react"

export const useLogin = () => {
  const [error, setError] = useState(null)

  const login = async (req, res) => {
    setError(null)
    const { username, password } = req;
    if (!username || !password)
      return res.status(400).send("Please enter username/password");
    var formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);
    var config = {
      method: "post",
      url: url.LOGIN,
      headers: formdata.getHeaders
        ? formdata.getHeaders()
        : { "Content-Type": "multipart/form-data" },
      data: formdata,
    };
    axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        setError(error.response.data.error);
      });
    
  };
  return { login, error };
};
