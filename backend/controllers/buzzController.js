const Buzz = require("../models/buzzModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

const createBuzz = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json("Please enter a message");
  }
  try {
    const user_id = req.user._id;
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
  try {
    const buzz = await Buzz.find({}).sort({ createdAt: -1 });
    res.status(200).json(buzz);
  } catch {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const buzz = await Buzz.findById(id);
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const buzz = await Buzz.find({ user_id: id }).sort({ createdAt: -1 });
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const like = async (req, res) => {
  const { id } = req.body;
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const profile = await Profile.findOne({ user: user_id });
    if (profile.hasLiked(id)) {
      await Buzz.findOneAndUpdate(
        { _id: id },
        { $pull: { likes: user_id } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { user: user_id },
        { $pull: { likes: id } },
        {
          new: true,
        }
      );
      const buzz = await Buzz.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ buzz: buzz, action: "unliked" });
    }
    await Buzz.findOneAndUpdate(
      { _id: id },
      { $push: { likes: user_id } },
      {
        new: true,
      }
    );
    await Profile.findOneAndUpdate(
      { user: user_id },
      { $push: { likes: id } },
      {
        new: true,
      }
    );
    //TODO: ADD DELETE FROM ARRAY TO UNLIKE
    const buzz = await Buzz.find({}).sort({ createdAt: -1 });
    res.status(200).json({ buzz: buzz, action: "liked" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createBuzz, getAllBuzz, getById, getByUser, like };
