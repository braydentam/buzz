const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const user = await User.signup(name, username, password);
    const token = createToken(user._id);
    const id = user._id;
    res.status(200).json({ username, id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    const id = user._id;
    res.status(200).json({ username, id, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };

//TODO: Stop sending ID back to frontend, remove ID part from frontend