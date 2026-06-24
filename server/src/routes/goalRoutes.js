const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { goalSchema } = require("../validators");
const {
  getGoals,
  createGoal,
  updateGoal,
  completeGoal,
  deleteGoal,
} = require("../controllers/goalController");

router.use(protect);

router.get("/", getGoals);
router.post("/", validate(goalSchema), createGoal);
router.put("/:id", updateGoal);
router.patch("/:id/complete", completeGoal);
router.delete("/:id", deleteGoal);

module.exports = router;
