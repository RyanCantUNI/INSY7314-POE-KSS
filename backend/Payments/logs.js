// logs.js — Get all payments by user ID

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import  connectToDatabase  from "../DB/db.js";
import tokenChecker from "../DB/token.js";

// Connect to MongoDB (reuse connection if already connected)
await connectToDatabase();

// Define Payment Schema (same as in payment.js — keep consistent)
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

// Reuse or create the model
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

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
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many log requests, try again later." },
  })
);

// Route: Get all payments for a given user ID
router.get("/logs/:id", tokenChecker, async (req, res) => {
  try {
    const userID = req.params.id;
    const logs = await Payment.find({ userID }).sort({ date: -1 });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No payment logs found for this user." });
    }

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).json({ message: "Error retrieving payment logs." });
  }
});

export default router;
