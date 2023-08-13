const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

//TODO: fix all namings (id should be id, etc);
const viewProfile = async (req, res) => {
  const { username } = req.body;
  try {
    const userProfile = await Profile.findOne({ username: username });
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const follow = async (req, res) => {
  const { follow_username } = req.body;
  const user_id = req.user._id;
  try {
    const profile = await Profile.findOne({ user: user_id });
    if (profile.isFollowing(follow_username)) {
      await Profile.findOneAndUpdate(
        { user: user_id },
        { $pull: { following: follow_username } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { username: follow_username },
        { $pull: { followers: profile.username } },
        {
          new: true,
        }
      );
      const userProfile = await Profile.findOne({ username: follow_username });
      return res
        .status(200)
        .json({ profile: userProfile, action: "unfollowed" });
    }
    await Profile.findOneAndUpdate(
      { user: user_id },
      { $push: { following: follow_username } },
      {
        new: true,
      }
    );
    await Profile.findOneAndUpdate(
      { username: follow_username },
      { $push: { followers: profile.username } },
      {
        new: true,
      }
    );
    const userProfile = await Profile.findOne({ username: follow_username });
    res.status(200).json({ profile: userProfile, action: "followed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewFollowing = async (req, res) => {
  const { username } = req.body;
  try {
    const userProfile = await Profile.findOne({ username: username });
    res.status(200).json(userProfile.following);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewFollowers = async (req, res) => {
  const { username } = req.body;
  try {
    const userProfile = await Profile.findOne({ username: username });
    res.status(200).json(userProfile.followers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const search = async (req, res) => {
  const { key } = req.body;
  if (!key) res.status(400).json({ error: "No Search Key" });
  try {
    let data = await Profile.find(
      {
        $or: [{ username: { $regex: key } }],
      },
      "username"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { viewProfile, follow, viewFollowing, viewFollowers, search };
