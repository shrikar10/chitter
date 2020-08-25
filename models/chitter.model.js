const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: "A comment is required",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "A comment needs to have a User",
  },
  username: {
    type: String,
    ref: "User",
    required: "A chitter needs to have a Username",
  },
});

const ChitterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "A chitter needs to have a User",
  },
  username: {
    type: String,
    ref: "User",
    required: "A chitter needs to have a Username",
  },
  chitter: {
    type: String,
    required: "A chitter needs to have a chitter.",
    trim: true,
  },
  comments: {
    type: [CommentsSchema],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chitter", ChitterSchema);