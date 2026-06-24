const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: 1,
    },
    bodyFat: {
      type: Number,
      min: 1,
      max: 70,
    },
    chest: { type: Number, min: 1 },
    waist: { type: Number, min: 1 },
    hips: { type: Number, min: 1 },
    arms: { type: Number, min: 1 },
    thighs: { type: Number, min: 1 },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Progress", progressSchema);
