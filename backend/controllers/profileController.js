const Profile = require("../models/profileModel");
const mongoose = require("mongoose");

const follow = async (req, res) => {
  const { follow_id } = req.body;
  const user_id = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(follow_id)) {
    return res.status(400).json("Please enter an id");
  }
  try {
    const profile = await Profile.findOne({ user: user_id });
    if (profile.isFollowing(follow_id)) {
      return res.status(400).json({ error: "Already Followed" });
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
    //TODO: ADD DELETE FROM ARRAY TO UNFOLLOW
    const profileArray = await Profile.find({}).sort({ createdAt: -1 });
    res.status(200).json(profileArray);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { follow };
