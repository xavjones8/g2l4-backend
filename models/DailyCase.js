const mongoose = require("mongoose");

// Define the Answer schema matching the TS type for Answer
const answerSchema = new mongoose.Schema({
  answerID: {
    type: Number,
    required: true,
  },
  questionID: {
    type: Number,
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
  answerExplanation: {
    type: String,
    required: true,
  },
});

// Define the Question schema matching the TS type for Question
const questionSchema = new mongoose.Schema({
  dailyCaseID: {
    type: Number,
    required: true,
  },
  questionID: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  answerChoices: {
    type: [answerSchema],
    required: true,
  },
  correctAnswerID: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  linksToQuestionInfo: {
    type: [String],
    required: true,
  },
});

// Define the DailyCase schema matching the TS type for DailyCase
const dailyCaseSchema = new mongoose.Schema(
  {
    dailyCaseID: {
      type: Number,
      required: true,
    },
    questionImage: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    linksToCaseInfo: {
      type: [String],
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  { collection: "updated_daily" }
);

dailyCaseSchema.index({ "$**": "text" }); // Create a text index on all fields for searching

module.exports = mongoose.model("DailyCase", dailyCaseSchema);
