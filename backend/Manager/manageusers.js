import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import { client } from "../DB/db.js";
//import { encryptField } from "../utils/encryption.js"; // if you moved encryption helper to utils

const router = express.Router();

// Get users collection
const users = client.db("APDS").collection("users");

// Middleware for manager authentication (JWT-based, for example)
import { managerAuth } from "../Auth/managerAuth.js";

// Password hashing rounds
const PASSWORD_SALT_ROUNDS = 12;

// Manager creates a new customer user
router.post("/users",
  authManager,
  [
    body("fullName")
      .trim()
      .matches(/^[A-Za-z\s\-']{3,50}$/).withMessage("Name must be letters, spaces, hyphens or apostrophes (3-50 chars)"),
    body("email")
      .isEmail().withMessage("Invalid email")
      .normalizeEmail(),
    body("idNumber")
      .matches(/^[0-9]{6,13}$/).withMessage("ID number must be digits (6-13)"),
    body("accountNumber")
      .matches(/^[0-9]{6,15}$/).withMessage("AccountNumber must be digits (6-15)"),
    body("password")
      .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })
      .withMessage("Password must be at least 8 chars and include numbers"),
    body("currency")
      .optional().isIn(["ZAR","USD","EUR","GBP","AUD","CAD"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { fullName, email, idNumber, accountNumber, password, currency } = req.body;
    try {
      const exists = await users.findOne({ email });
      if (exists) return res.status(409).json({ message: "User already exists" });

      const UUID = uuidv4();
      const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

      const encryptedId = encryptField(idNumber);
      const encryptedAcc = encryptField(accountNumber);

      const userModel = {
        uuid: UUID,
        fullName,
        email,
        idNumber: encryptedId,
        accountNumber: encryptedAcc,
        passwordHash,
        createdAt: new Date(),
      };

      await users.insertOne(userModel);
      return res.status(201).json({ message: "User created" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;