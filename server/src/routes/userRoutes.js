const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { profileSchema } = require("../validators");

router.use(protect);

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", validate(profileSchema), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.validatedBody, {
      new: true,
      runValidators: true,
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/account", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
