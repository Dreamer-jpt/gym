const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
      unique: true,
    },
    muscleGroup: {
      type: String,
      required: [true, "Muscle group is required"],
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Legs",
        "Core",
        "Cardio",
        "Full Body",
      ],
    },
    equipment: {
      type: String,
      default: "None",
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    instructions: {
      type: String,
      trim: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

exerciseSchema.index({ muscleGroup: 1 });
exerciseSchema.index({ name: "text" });

module.exports = mongoose.model("Exercise", exerciseSchema);
