const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Exercise = require("../models/Exercise");

const defaultExercises = [
  { name: "Bench Press", muscleGroup: "Chest", equipment: "Barbell", difficulty: "intermediate", instructions: "Lie on bench, lower barbell to chest, press up" },
  { name: "Squat", muscleGroup: "Legs", equipment: "Barbell", difficulty: "intermediate", instructions: "Stand with barbell on shoulders, lower hips, stand up" },
  { name: "Deadlift", muscleGroup: "Back", equipment: "Barbell", difficulty: "advanced", instructions: "Hinge at hips, pull barbell up, stand tall" },
  { name: "Pull Up", muscleGroup: "Back", equipment: "Pull up bar", difficulty: "intermediate", instructions: "Hang from bar, pull yourself up" },
  { name: "Push Up", muscleGroup: "Chest", equipment: "None", difficulty: "beginner", instructions: "Plank position, lower chest, push up" },
  { name: "Shoulder Press", muscleGroup: "Shoulders", equipment: "Dumbbells", difficulty: "intermediate", instructions: "Press dumbbells overhead from shoulders" },
  { name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell", difficulty: "intermediate", instructions: "Bend at hips, pull barbell to lower chest" },
  { name: "Bicep Curl", muscleGroup: "Biceps", equipment: "Dumbbells", difficulty: "beginner", instructions: "Curl dumbbells toward shoulders" },
  { name: "Tricep Pushdown", muscleGroup: "Triceps", equipment: "Cable", difficulty: "beginner", instructions: "Push cable attachment down, extend elbows" },
  { name: "Plank", muscleGroup: "Core", equipment: "None", difficulty: "beginner", instructions: "Hold forearm plank position" },
  { name: "Running", muscleGroup: "Cardio", equipment: "None", difficulty: "beginner", instructions: "Run at comfortable pace" },
  { name: "Leg Press", muscleGroup: "Legs", equipment: "Machine", difficulty: "beginner", instructions: "Press platform with legs" },
  { name: "Lunges", muscleGroup: "Legs", equipment: "Dumbbells", difficulty: "intermediate", instructions: "Step forward, lower back knee" },
  { name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable", difficulty: "beginner", instructions: "Pull bar down to upper chest" },
  { name: "Cable Row", muscleGroup: "Back", equipment: "Cable", difficulty: "beginner", instructions: "Pull cable attachment toward torso" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const exercise of defaultExercises) {
      await Exercise.findOneAndUpdate(
        { name: exercise.name, isCustom: false },
        { ...exercise, isCustom: false, userId: null },
        { upsert: true, new: true }
      );
    }

    console.log("Default exercises seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
