import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { body, validationResult, param, query } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { filterXSS } from "xss";
import cors from "cors";

import { client } from "../DB/db.js"; // your existing Mongo client

const router = express.Router();

// Middlewares for general security
router.use(helmet());
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
router.use(cors({
  origin: ["https://localhost:443/api/manager"], // restrict to your frontend origin(s)
}));

// Rate limiter - protects against brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, try again later." },
});

router.use(authLimiter);

// Collections
const users = client.db("APDS").collection("users");
const managers = client.db("APDS").collection("managers"); // pre-registered staff collection

// env-config (ensure these exist in process.env)
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_random"; // production: strong secret from env/KMS
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const PASSWORD_SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS || "12", 10);

// Encryption key for PII (32 bytes for AES-256)
// PRODUCTION: use a KMS and rotate keys; do not store raw in plain env for long-lived deployments
const ENC_KEY = process.env.PII_ENC_KEY; // base64 encoded 32 bytes
if (!ENC_KEY) {
  console.warn("Warning: PII_ENC_KEY not set. Generate a 32 byte key and set env var PII_ENC_KEY.");
}
const KEY_BUFFER = ENC_KEY ? Buffer.from(ENC_KEY, "base64") : null;
const ALGORITHM = "aes-256-gcm";

// Helper: encrypt / decrypt field
function encryptField(plaintext) {
  if (!KEY_BUFFER) throw new Error("Encryption key not configured");
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
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

// Auth middleware (managers)
function authManager(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing authorization header" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid authorization header" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // require role 'manager' (pre-registered employee)
    if (!payload || payload.role !== "manager") return res.status(403).json({ message: "Forbidden" });
    req.manager = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ---------- Manager login (pre-registered managers) ----------
router.post("/manager/login",
  [
    body("username").isString().isLength({ min: 3, max: 50 }),
    body("password").isString().isLength({ min: 8, max: 128 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid login input", errors: errors.array() });

    const { username, password } = req.body;
    try {
      const manager = await managers.findOne({ username });
      if (!manager) return res.status(401).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, manager.passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ sub: manager._id.toString(), username: manager.username, role: "manager" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;