const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { workoutSchema } = require("../validators");
const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getSummary,
} = require("../controllers/workoutController");

router.use(protect);

router.get("/stats/summary", getSummary);
router.get("/", getWorkouts);
router.post("/", validate(workoutSchema), createWorkout);
router.get("/:id", getWorkout);
router.put("/:id", validate(workoutSchema), updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
