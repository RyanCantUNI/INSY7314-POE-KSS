import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectToDatabase } from "../DB/db.js";

// Connect to MongoDB (reuse existing connection)
await connectToDatabase();

const router = express.Router();

// Middleware setup
router.use(express.json());
router.use(helmet());
router.use(
  cors({
    origin: ["https://localhost:443"],
  })
);
router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit registration attempts
    message: { message: "Too many registration attempts, try again later." },
  })
);

// Define User Schema
const userSchema = new mongoose.Schema({
  UUID: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Reuse or create model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Validation rules
const registerValidators = [
  body("fullName").isLength({ min: 3, max: 50 }),
  body("email").isEmail(),
  body("idNumber").isLength({ min: 6, max: 13 }),
  body("accountNumber").isLength({ min: 6, max: 15 }),
  body("password").isLength({ min: 8 }),
];

// Registration endpoint
router.post("/register", registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid input.", errors: errors.array() });

  try {
    const { fullName, email, idNumber, accountNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists with this email." });

    // Hash sensitive fields
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedIDnum = await bcrypt.hash(idNumber, 10);
    const hashedAccNum = await bcrypt.hash(accountNumber, 10);

    const newUser = new User({
      UUID: uuidv4(),
      fullName,
      email,
      idNumber: hashedIDnum,
      accountNumber: hashedAccNum,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userID: newUser.UUID,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

export default router;
