const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
