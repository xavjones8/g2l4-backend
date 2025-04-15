const mongoose = require("mongoose");
const DailyCase = require("./DailyCase");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    completedDailyCases: [DailyCase.schema],
    lastLogin: { type: Date, default: Date.now },
    points: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
