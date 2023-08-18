import axios from "axios";
import * as url from "./urls";

export const login = async (req, res) => {
  const { username, password } = req;
  var formdata = new FormData();
  formdata.append("username", username.toLowerCase());
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const signup = async (req, res) => {
  const { name, username, password } = req;
  var formdata = new FormData();
  formdata.append("name", name);
  formdata.append("username", username.toLowerCase());
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
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
      res(response.data);
    })
    .catch(function (error) {
      res({ error: error });
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
      res(response.data);
    })
    .catch(function (error) {
      res({ error: error.response.data.error });
    });
};

export const getByUsername = async (req, res) => {
  const { username } = req;
  var config = {
    method: "get",
    url: url.GETBYUSERNAME + "/" + username,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error });
    });
};

export const createBuzz = async (req, res) => {
  const { message, comment } = req;
  var formdata = new FormData();
  formdata.append("message", message);
  if (comment) {
    formdata.append("comment", comment);
  }
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const like = async (req, res) => {
  const { likeID } = req;
  var formdata = new FormData();
  formdata.append("likeID", likeID);
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const getProfile = async (req, res) => {
  const { username } = req;
  var config = {
    method: "get",
    url: url.GETPROFILE + "/" + username,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      res({ error: error });
    });
};

export const follow = async (req, res) => {
  const { followUsername } = req;
  var formdata = new FormData();
  formdata.append("followUsername", followUsername);
  var config = {
    method: "post",
    url: url.FOLLOW,
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const getFollowingBuzzes = async (res) => {
  var config = {
    method: "get",
    url: url.GETFOLLOWINGBUZZES,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      res({ error: error });
    });
};

export const getComments = async (req, res) => {
  const { parentID } = req;
  var config = {
    method: "get",
    url: url.GETCOMMENTS + "/" + parentID,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const deleteBuzz = async (req, res) => {
  const { deleteID } = req;
  var formdata = new FormData();
  formdata.append("deleteID", deleteID);
  var config = {
    method: "delete",
    url: url.DELETE,
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
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const getFollowers = async (req, res) => {
  const { username } = req;
  var config = {
    method: "get",
    url: url.GETFOLLOWERS + "/" + username,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
      "Content-Type": "multipart/form-data",
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const getFollowing = async (req, res) => {
  const { username } = req;
  var config = {
    method: "get",
    url: url.GETFOLLOWING + "/" + username,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
      "Content-Type": "multipart/form-data",
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const search = async (req, res) => {
  const { query } = req;
  if (!query) {
    res({ error: "Please enter a search query" });
  }
  var formdata = new FormData();
  formdata.append("query", query.toLowerCase());
  var config = {
    method: "post",
    url: url.SEARCH,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
      "Content-Type": "multipart/form-data",
    },
    data: formdata,
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res({ error: error.response.data.error });
    });
};

export const hasPosted = async (res) => {
  var config = {
    method: "get",
    url: url.HASPOSTED,
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("user"))["token"]
      }`,
    },
  };
  axios(config)
    .then(function (response) {
      res(response.data);
    })
    .catch(function (error) {
      res({ error: error });
    });
};
