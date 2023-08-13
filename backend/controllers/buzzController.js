const Buzz = require("../models/buzzModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

//TODO: have uniform titling of responses

const createBuzz = async (req, res) => {
  const { message, comment } = req.body;
  if (!message) {
    return res.status(400).json("Please enter a message");
  }
  try {
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    const name = user.name;
    const username = user.username;
    const buzz = await Buzz.create({
      user_id,
      name,
      username,
      message,
      comment,
    });

    if (comment) {
      const parentBuzz = await Buzz.findById(comment);
      await parentBuzz.newComment();
    }
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBuzz = async (req, res) => {
  try {
    const user_id = req.user._id;
    const buzz = await Buzz.find({ comment: { $exists: false } }).sort({
      createdAt: -1,
    });
    const liked = await Buzz.find({ likes: user_id }).sort({ createdAt: -1 });
    res.status(200).json({ buzz: buzz, liked: liked });
  } catch (error) {
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
    const buzz = await Buzz.find({
      username: id,
      comment: { $exists: false },
    }).sort({ createdAt: -1 });
    const comments = await Buzz.find({
      username: id,
      comment: { $exists: true },
    }).sort({ createdAt: -1 });
    const user = await User.findOne({ username: id });
    const liked = await Buzz.find({ likes: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ buzz: buzz, comments: comments, liked: liked });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBuzz = async (req, res) => {
  const { id } = req.body;

  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }
  const b = await Buzz.findOne({ _id: id });

  if (b.comment) {
    const parentBuzz = await Buzz.findOne({ _id: b.comment });
    await parentBuzz.newComment();
  }
  
  const deleted = await Buzz.findOneAndDelete({ _id: id });

  if (!deleted) {
    return res.status(400).json({ error: "No such workout" });
  }

  const buzz = await Buzz.find({
    comment: { $exists: false },
  }).sort({ createdAt: -1 });
  const comments = await Buzz.find({
    comment: { $exists: true },
  }).sort({ createdAt: -1 });

  const liked = await Buzz.find({ likes: user_id }).sort({ createdAt: -1 });
  res
    .status(200)
    .json({ delete: deleted, buzz: buzz, comments: comments, liked: liked });
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
      const buzz = await Buzz.find({ comment: { $exists: false } }).sort({
        createdAt: -1,
      });
      const comments = await Buzz.find({ comment: { $exists: true } }).sort({
        createdAt: -1,
      });
      const liked = await Buzz.find({ likes: user_id }).sort({ createdAt: -1 });
      return res.status(200).json({
        buzz: buzz,
        comment: comments,
        liked: liked,
        action: "unliked",
      });
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
    const buzz = await Buzz.find({ comment: { $exists: false } }).sort({
      createdAt: -1,
    });
    const comments = await Buzz.find({ comment: { $exists: true } }).sort({
      createdAt: -1,
    });
    const liked = await Buzz.find({ likes: user_id }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ buzz: buzz, comment: comments, liked: liked, action: "liked" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const userProfile = await Profile.findOne({ user: user_id });
    const buzz = await Buzz.find({ username: userProfile.following });
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const comments = async (req, res) => {
  const { parent_id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(parent_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const buzz = await Buzz.find({ comment: parent_id });
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const hasPosted = async (req, res) => {
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const buzz = await Buzz.findOne({
      user_id: user_id,
      comment: { $exists: false },
    }).sort({ _id: -1 });
    let date = new Date().toISOString().substring(0, 10);
    res
      .status(200)
      .json(date === buzz.createdAt.toISOString().substring(0, 10));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBuzz,
  getAllBuzz,
  getById,
  getByUser,
  deleteBuzz,
  like,
  getFollowing,
  comments,
  hasPosted,
};
