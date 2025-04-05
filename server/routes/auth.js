const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, age, bloodGroup, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    age,
    bloodGroup,
    role,
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
    expiresIn: "1d",
  });
  res.status(201).json({ token, user: newUser });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user });
});

const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});

module.exports = router;
