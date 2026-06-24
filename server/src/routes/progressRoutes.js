const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { progressSchema } = require("../validators");
const {
  getProgress,
  getLatest,
  createProgress,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");

router.use(protect);

router.get("/latest", getLatest);
router.get("/", getProgress);
router.post("/", validate(progressSchema), createProgress);
router.put("/:id", validate(progressSchema), updateProgress);
router.delete("/:id", deleteProgress);

module.exports = router;
