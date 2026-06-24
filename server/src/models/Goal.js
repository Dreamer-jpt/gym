const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["target_weight", "weekly_workouts", "strength", "custom"],
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    targetValue: {
      type: Number,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    targetDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "failed"],
      default: "active",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });

goalSchema.pre("save", function (next) {
  if (this.targetValue && this.targetValue > 0) {
    this.progress = Math.min(
      100,
      Math.round((this.currentValue / this.targetValue) * 100)
    );
  }
  if (this.progress >= 100 && this.status === "active") {
    this.status = "completed";
  }
  next();
});

module.exports = mongoose.model("Goal", goalSchema);
