const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getOverview,
  getVolume,
  getMuscleGroups,
  getWeightProgress,
  getPersonalRecords,
} = require("../controllers/analyticsController");

router.use(protect);

router.get("/overview", getOverview);
router.get("/volume", getVolume);
router.get("/muscle-groups", getMuscleGroups);
router.get("/weight-progress", getWeightProgress);
router.get("/personal-records", getPersonalRecords);

module.exports = router;
