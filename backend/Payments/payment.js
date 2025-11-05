import express from "express";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import { connectToDatabase } from "../DB/db.js";
import tokenChecker from "../DB/token.js";

// 1️⃣ Connect to Database
await connectToDatabase();

// 2️⃣ Define Payment Schema
const paymentSchema = new mongoose.Schema({
  paymentID: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  userID: { type: String, required: true },
  amount: { type: Number, required: true },
  providerAccount: { type: String, required: true },
  currency: { type: String, required: true },
  SWIFTCode: { type: String, required: true },
  status: { type: String, default: "Completed" },
});

// Create Payment Model
const Payment = mongoose.model("Payment", paymentSchema);

// Set up Express Router
const router = express.Router();

// Middleware setup
router.use(express.json());
router.use(helmet());
router.use(
  cors({
    origin: ["https://localhost:443"], // adjust for your frontend
  })
);
router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many payment attempts, try again later." },
  })
);

// Validators
const paymentValidators = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number."),
  body("providerAccount")
    .isLength({ min: 6, max: 20 })
    .withMessage("Provider account length must be 6–20 characters."),
  body("currency")
    .isIn(["USD", "EUR", "ZAR", "GBP"])
    .withMessage("Unsupported currency."),
  body("SWIFTCode")
    .isLength({ min: 4, max: 11 })
    .withMessage("Invalid SWIFT code length."),
];

// Route Handler
router.post("/payment/:id", tokenChecker, paymentValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userID = req.params.id;
    const { amount, providerAccount, currency, SWIFTCode } = req.body;

    // Create payment record
    const paymentRecord = new Payment({
      paymentID: uuidv4(),
      userID,
      amount: parseFloat(amount),
      providerAccount,
      currency,
      SWIFTCode,
      status: "Completed",
    });

    await paymentRecord.save();

    return res.status(201).json({
      message: "Payment successful",
      paymentID: paymentRecord.paymentID,
      date: paymentRecord.date,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Internal server error during payment" });
  }
});

export default router;
