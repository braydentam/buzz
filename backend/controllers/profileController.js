const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

const getProfile = async (req, res) => {
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const userProfile = await Profile.findOne({ user: user_id });
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const follow = async (req, res) => {
  const { follow_id } = req.body;
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(follow_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const profile = await Profile.findOne({ user: user_id });
    if (profile.isFollowing(follow_id)) {
      await Profile.findOneAndUpdate(
        { user: user_id },
        { $pull: { following: follow_id } },
        {
          new: true,
        }
      );
      await Profile.findOneAndUpdate(
        { user: follow_id },
        { $pull: { followers: user_id } },
        {
          new: true,
        }
      );
      const userProfile = await Profile.find({ user: user_id }).sort({
        createdAt: -1,
      });
      return res
        .status(200)
        .json({ profile: userProfile, action: "unfollowed" });
    }
    await Profile.findOneAndUpdate(
      { user: user_id },
      { $push: { following: follow_id } },
      {
        new: true,
      }
    );
    await Profile.findOneAndUpdate(
      { user: follow_id },
      { $push: { followers: user_id } },
      {
        new: true,
      }
    );
    const userProfile = await Profile.find({ user: user_id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ profile: userProfile, action: "followed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getProfile, follow };
