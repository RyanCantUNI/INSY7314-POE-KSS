// managerAuth.js
import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { filterXSS } from "xss";
import cors from "cors";
import mongoose from "mongoose";
import { connectToDatabase } from "../DB/db.js";

// connect to MongoDB
await connectToDatabase();

const router = express.Router();

// Security middlewares
router.use(helmet());
router.use(
  cors({
    origin: ["https://localhost:443"],
  })
);

// XSS sanitization middleware
router.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;
    for (const key in obj) {
      if (typeof obj[key] === "string") obj[key] = filterXSS(obj[key]);
      else if (typeof obj[key] === "object") sanitize(obj[key]);
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// Rate limiter (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many requests, please try again later." },
});

router.use(authLimiter);

// ==========================
// ENV CONFIG
// ==========================
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_random";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const PASSWORD_SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || "12", 10);

// Optional AES encryption key
const ENC_KEY = process.env.PII_ENC_KEY;
const KEY_BUFFER = ENC_KEY ? Buffer.from(ENC_KEY, "base64") : null;
const ALGORITHM = "aes-256-gcm";

// Helper encryption utilities
function encryptField(plaintext) {
  if (!KEY_BUFFER) throw new Error("Encryption key not configured");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${ciphertext.toString("base64")}`;
}

function decryptField(pkg) {
  if (!KEY_BUFFER) throw new Error("Encryption key not configured");
  const [ivB64, tagB64, ctB64] = String(pkg || "").split(":");
  if (!ivB64 || !tagB64 || !ctB64) return null;
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

// ==========================
// Mongoose Schema & Model
// ==========================
const managerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  UUID: { type: String, required: true, unique: true },
  role: { type: String, default: "manager" },
  createdAt: { type: Date, default: Date.now },
});

const Manager = mongoose.models.Manager || mongoose.model("Manager", managerSchema);

// ==========================
// Auth Middleware
// ==========================
export function authManager(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid authorization header" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    req.manager = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ==========================
// Manager Login Route
// ==========================
router.post(
  "/manager/login",
  [
    body("username").isString().isLength({ min: 3, max: 50 }),
    body("password").isString().isLength({ min: 8, max: 128 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const { username, password } = req.body;

    try {
      const manager = await Manager.findOne({ username });
      if (!manager) return res.status(401).json({ message: "Invalid credentials" });

      const valid = await bcrypt.compare(password, manager.passwordHash);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          sub: manager._id.toString(),
          username: manager.username,
          role: "manager",
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
