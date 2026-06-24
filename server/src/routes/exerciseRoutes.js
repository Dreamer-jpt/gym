const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { exerciseSchema } = require("../validators");
const {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");

router.use(protect);

router.get("/", getExercises);
router.post("/", validate(exerciseSchema), createExercise);
router.get("/:id", getExercise);
router.put("/:id", validate(exerciseSchema), updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;
