import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: String,
      enum: ['civ', 'wor', 'und'], // restricts the values to civ, wor, or und
      required: true,
    },
    badges: {
      type: [Number], // Array of numbers representing badge IDs (1, 2, 3, etc.)
      default: [], // initializes as an empty array
    },
    totalDonations: {
      type: mongoose.Decimal128,
      default: 0,
    },
    totalJobsOpened: {
      type: Number,
      default: 0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
