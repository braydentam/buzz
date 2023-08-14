const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

//TODO: fix all namings (id should be id, etc);
const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await Profile.findOne({ username: username });
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const follow = async (req, res) => {
  const { followUsername } = req.body;
  const userID = req.user._id;
  try {
    const userProfile = await Profile.findOne({ user: userID });
    if (userProfile.isFollowing(followUsername)) {
      await Profile.findOneAndUpdate(
        { user: userID },
        { $pull: { following: followUsername } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { username: followUsername },
        { $pull: { followers: userProfile.username } },
        {
          new: true,
        }
      );
      const followProfile = await Profile.findOne({ username: followUsername });
      return res
        .status(200)
        .json({ profile: followProfile, action: "unfollowed" });
    }
    await Profile.findOneAndUpdate(
      { user: userID },
      { $push: { following: followUsername } },
      {
        new: true,
      }
    );
    await Profile.findOneAndUpdate(
      { username: followUsername },
      { $push: { followers: userProfile.username } },
      {
        new: true,
      }
    );
    const followProfile = await Profile.findOne({ username: followUsername });
    res.status(200).json({ profile: followProfile, action: "followed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowing = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await Profile.findOne({ username: username });
    res.status(200).json(profile.following);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFollowers = async (req, res) => {
  const { username } = req.params;
  try {
    const profile = await Profile.findOne({ username: username });
    res.status(200).json(profile.followers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const search = async (req, res) => {
  const { query } = req.body;
  if (!query) res.status(400).json({ error: "No Search Key" });
  try {
    let data = await Profile.find(
      {
        $or: [{ username: { $regex: query } }],
      },
      "username"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { getProfile, follow, getFollowing, getFollowers, search };
