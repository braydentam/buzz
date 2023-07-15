import axios from "axios";
import * as url from "./urls";

export const login = async (req, res) => {
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
      localStorage.setItem("user", JSON.stringify(response.data));
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      if (res) {
        res({ error: error.response.data.error });
      }
      return { error: error.response.data.error };
    });
};

export const signup = async (req, res) => {
  const { name, username, password } = req;
  if (!name || !username || !password)
    return res.status(400).send("Please enter name/username/password");
  var formdata = new FormData();
  formdata.append("name", name);
  formdata.append("username", username);
  formdata.append("password", password);
  var config = {
    method: "post",
    url: url.SIGNUP,
    headers: formdata.getHeaders
      ? formdata.getHeaders()
      : { "Content-Type": "multipart/form-data" },
    data: formdata,
  };
  axios(config)
    .then(function (response) {
      localStorage.setItem("user", JSON.stringify(response.data));
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      if (res) {
        res({ error: error.response.data.error });
      }
      return { error: error.response.data.error };
    });
};

export const getExplore = async (res) => {
  var config = {
    method: "get",
    url: url.GETEXPLORE,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      if (res) {
        res({ error: error });
      }
      return { error: error };
    });
};

export const getById = async (req, res) => {
  const { id } = req;
  var config = {
    method: "get",
    url: url.GETBYID + "/" + id,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      if (res) {
        res({ error: error.response.data.error });
      }
      return { error: error.response.data.error };
    });
};

export const getByUser = async (req, res) => {
  const { id } = req;
  var config = {
    method: "get",
    url: url.GETBYUSER + "/" + id,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      if (res) {
        res({ error: error });
      }
      return { error: error };
    });
};

export const createBuzz = async (req, res) => {
  const { message } = req;
  if (!message) return res.status(400).send("Please enter a message");
  var formdata = new FormData();
  formdata.append("message", message);
  var config = {
    method: "post",
    url: url.CREATEBUZZ,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
    data: formdata,
  };
  axios(config)
    .then(function (response) {
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      if (res) {
        res({ error: error.response.data.error });
      }
      return { error: error.response.data.error };
    });
};


export const like = async (req, res) => {
  console.log(req);
  const { id } = req;
  if (!id) return res.status(400).send("Please enter a id");
  var formdata = new FormData();
  formdata.append("id", id);
  var config = {
    method: "post",
    url: url.LIKE,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
    data: formdata,
  };
  axios(config)
    .then(function (response) {
      if (res) {
        res(response.data);
      }
      return response.data;
    })
    .catch(function (error) {
      console.log(error.response.data.error);
      if (res) {
        res({ error: error.response.data.error });
      }
      return { error: error.response.data.error };
    });
};