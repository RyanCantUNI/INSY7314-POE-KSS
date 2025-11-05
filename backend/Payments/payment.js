// makePayment.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { client } from "../DB/db.js";
import tokenChecker from "../DB/token.js";

const router = express.Router();

// Collections
const payments = client.db("APDS").collection("payments");

// Middlewares
router.use(express.json());
router.use(helmet());
router.use(cors({
  origin: ["https://localhost:443"],
}));
router.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many payment attempts, try again later." },
}));

// Validators
const paymentValidators = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number."),
  body("providerAccount").isLength({ min: 6, max: 20 }).trim(),
  body("currency").isIn(["USD", "EUR", "ZAR", "GBP"]).withMessage("Unsupported currency."),
  body("SWIFTCode").isLength({ min: 4, max: 11 }).trim(),
];

// Route
router.post("/payment/:id", tokenChecker, paymentValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userID = req.params.id;
    const { amount, providerAccount, currency, SWIFTCode } = req.body;

    // Simulated SWIFT API call placeholder
    // const swiftResponse = await callSwiftAPI(...);

    const paymentRecord = {
      paymentID: uuidv4(),
      date: new Date().toISOString(),
      userID,
      amount: parseFloat(amount),
      providerAccount,
      currency,
      SWIFTCode,
      status: "Completed",
    };

    await payments.insertOne(paymentRecord);

    return res.status(200).json({
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
