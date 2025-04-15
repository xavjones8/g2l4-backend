const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dailyCaseID: {
      type: Number,
      required: true,
    },
    questionID: {
      type: Number,
      required: true,
    },
    answerID: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    collection: "feedback",
    versionKey: false,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
