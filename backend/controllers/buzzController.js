const Buzz = require("../models/buzzModel");
const User = require("../models/userModel");

const createBuzz = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json("Please enter a message");
  }
  try {
    const user_id= req.user._id;
    const user = await User.findById(user_id);
    const name = user.name;
    const username = user.username;
    const buzz = await Buzz.create({ user_id, name, username, message });
    
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBuzz = async (req, res) => {
  const buzz = await Buzz.find({}).sort({ createdAt: -1 });
  res.status(200).json(buzz);
};
module.exports = { createBuzz, getAllBuzz };
