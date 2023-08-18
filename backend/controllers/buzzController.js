const mongoose = require("mongoose");
const Buzz = require("../models/buzzModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const createBuzz = async (req, res) => {
  const { message, comment } = req.body;

  if (!message) {
    return res.status(400).json("Please enter a message");
  }

  try {
    const userID = req.user._id;
    const user = await User.findById(userID);
    const name = user.name;
    const username = user.username;
    const buzz = await Buzz.create({
      userID,
      name,
      username,
      message,
      comment,
    });
    if (comment) {
      const parentBuzz = await Buzz.findById(comment);
      await parentBuzz.updateCommentCount();
      //if post is a comment, increment comment count of parent
    }
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const userID = req.user._id;
    const buzz = await Buzz.find({ comment: { $exists: false } }).sort({
      createdAt: -1,
    });
    const liked = await Buzz.find({ likes: userID }).sort({
      createdAt: -1,
    });
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

const getByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const buzz = await Buzz.find({
      username: username,
      comment: { $exists: false },
    }).sort({ createdAt: -1 });
    const comments = await Buzz.find({
      username: username,
      comment: { $exists: true },
    }).sort({ createdAt: -1 });
    const user = await User.findOne({ username: username });
    const liked = await Buzz.find({ likes: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ buzz: buzz, comments: comments, liked: liked });
    //returns a user's buzzes, comments, and liked posts
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBuzz = async (req, res) => {
  const { deleteID } = req.body;
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(deleteID)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const originalBuzz = await Buzz.findOne({ _id: deleteID });
  const deleted = await Buzz.findOneAndDelete({ _id: deleteID });
  if (!deleted) {
    return res.status(400).json({ error: "No such workout" });
  }
  if (originalBuzz && originalBuzz.comment) {
    const parentBuzz = await Buzz.findOne({ _id: originalBuzz.comment });
    if (parentBuzz) {
      await parentBuzz.updateCommentCount();
      //if post is a comment, decrement the comment count of the parent
    }
  }

  const buzz = await Buzz.find({
    comment: { $exists: false },
  }).sort({ createdAt: -1 });
  const comments = await Buzz.find({
    comment: { $exists: true },
  }).sort({ createdAt: -1 });
  const liked = await Buzz.find({ likes: userID }).sort({ createdAt: -1 });
  res
    .status(200)
    .json({ buzz: buzz, comments: comments, liked: liked });
  //returns the updated buzzes, comments, and liked posts after deletion
};

const likeBuzz = async (req, res) => {
  const { likeID } = req.body;
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(likeID)) {
    return res.status(400).json("Please enter an id");
  }

  try {
    const profile = await Profile.findOne({ user: userID });
    var action = "";
    if (profile.hasLiked(likeID)) {
      await Buzz.findOneAndUpdate(
        { _id: likeID },
        { $pull: { likes: userID } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { user: userID },
        { $pull: { likes: likeID } },
        {
          new: true,
        }
      );
      action = "unliked";
    } else {
      await Buzz.findOneAndUpdate(
        { _id: likeID },
        { $push: { likes: userID } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { user: userID },
        { $push: { likes: likeID } },
        {
          new: true,
        }
      );
      action = "liked";
    }

    const buzz = await Buzz.find({ comment: { $exists: false } }).sort({
      createdAt: -1,
    });
    const comments = await Buzz.find({ comment: { $exists: true } }).sort({
      createdAt: -1,
    });
    const liked = await Buzz.find({ likes: userID }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ buzz: buzz, comment: comments, liked: liked, action: action });
      //returns the updated buzzes, comments, and liked posts after liking/unliking
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  const userID = req.user._id;

  try {
    const userProfile = await Profile.findOne({ user: userID });
    const buzz = await Buzz.find({
      username: userProfile.following,
      comment: { $exists: false },
    });
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const { parentID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(parentID)) {
    return res.status(400).json("Please enter an id");
  }

  try {
    const buzz = await Buzz.find({ comment: parentID });
    res.status(200).json(buzz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const hasPosted = async (req, res) => {
  const userID = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json("Please enter an id");
  }

  try {
    const buzz = await Buzz.findOne({
      userID: userID,
      comment: { $exists: false },
    }).sort({ _id: -1 });
    if (buzz) {
      let currentDate = new Date().toISOString().substring(0, 10);
      let lastPostedDate = buzz.createdAt.toISOString().substring(0, 10);
      res.status(200).json(currentDate === lastPostedDate);
      //return if the user has posted on the current date
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBuzz,
  getAll,
  getById,
  getByUsername,
  deleteBuzz,
  likeBuzz,
  getFollowing,
  getComments,
  hasPosted,
};
