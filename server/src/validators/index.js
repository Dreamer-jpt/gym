const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const workoutSchema = z.object({
  title: z.string().min(1).max(100),
  date: z.string().datetime({ offset: true }).or(z.string()),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1),
        muscleGroup: z.string().min(1),
        sets: z.number().int().min(1),
        reps: z.number().int().min(1),
        weight: z.number().min(0).default(0),
        duration: z.number().min(0).optional(),
        notes: z.string().optional(),
      })
    )
    .min(1),
  duration: z.number().min(0).default(0),
  notes: z.string().max(500).optional(),
});

const exerciseSchema = z.object({
  name: z.string().min(1).max(100),
  muscleGroup: z.enum([
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Core",
    "Cardio",
    "Full Body",
  ]),
  equipment: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  instructions: z.string().optional(),
});

const progressSchema = z.object({
  date: z.string().datetime({ offset: true }).or(z.string()).optional(),
  weight: z.number().min(1),
  bodyFat: z.number().min(1).max(70).optional(),
  chest: z.number().min(1).optional(),
  waist: z.number().min(1).optional(),
  hips: z.number().min(1).optional(),
  arms: z.number().min(1).optional(),
  thighs: z.number().min(1).optional(),
});

const goalSchema = z.object({
  type: z.enum(["target_weight", "weekly_workouts", "strength", "custom"]),
  title: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  targetDate: z.string().datetime({ offset: true }).or(z.string()).optional(),
});

const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().int().min(1).max(150).optional(),
  height: z.number().min(1).optional(),
  weight: z.number().min(1).optional(),
  fitnessGoal: z
    .enum(["muscle_gain", "fat_loss", "strength", "endurance", "general_fitness"])
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  workoutSchema,
  exerciseSchema,
  progressSchema,
  goalSchema,
  profileSchema,
};
