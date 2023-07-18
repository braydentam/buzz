const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
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
