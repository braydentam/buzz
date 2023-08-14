const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buzzSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Buzz",
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

buzzSchema.methods.newComment = async function () {
  this.commentCount = await mongoose
    .model("Buzz")
    .countDocuments({ comment: this._id });
  return this.save();
};

module.exports = mongoose.model("Buzz", buzzSchema);
