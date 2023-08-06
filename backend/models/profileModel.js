const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: String,
    },
  ],
  followers: [
    {
      type: String,
    },
  ],
});

profileSchema.methods.hasLiked = function (buzzId) {
  return this.likes.some((id) => id.equals(buzzId));
};

profileSchema.methods.isFollowing = function (followId) {
  return this.following.some((id) => id.equals(followId));
};

module.exports = mongoose.model("Profile", profileSchema);
