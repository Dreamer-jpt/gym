const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Exercise name is required"], trim: true },
    muscleGroup: { type: String, required: true, trim: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, default: 0, min: 0 },
    duration: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
      maxlength: 100,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    exercises: {
      type: [exerciseSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one exercise is required",
      },
    },
    duration: {
      type: Number,
      min: 0,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, "exercises.muscleGroup": 1 });

workoutSchema.pre("save", function (next) {
  this.totalVolume = this.exercises.reduce(
    (total, ex) => total + (ex.weight || 0) * ex.sets * ex.reps,
    0
  );
  this.caloriesBurned = Math.round(this.duration * 7.5);
  next();
});

module.exports = mongoose.model("Workout", workoutSchema);
