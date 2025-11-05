// managerdashboard.js - Get all users for manager dashboard
import express from "express";
import { query, param } from "express-validator";
import { ObjectId } from "mongodb";
import { authManager } from "../Auth/managerAuth.js";
import { connectToDatabase } from "../DB/db.js";

const router = express.Router();

// Get all users
router.get("/users",
  authManager,
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 25;
    const skip = (page - 1) * limit;
    
    try {
      const cursor = users.find({}, { projection: { passwordHash: 0 } }).skip(skip).limit(limit);
      const docs = await cursor.toArray();
      
      // Transform data
      const userList = docs.map(doc => ({
        id: doc._id.toString(),
        uuid: doc.uuid,
        fullName: doc.fullName || 'N/A',
        email: doc.email || 'N/A',
        idNumber: decryptField(doc.idNumber) || 'N/A',
        accountNumber: decryptField(doc.accountNumber) || 'N/A',
        createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A',
        status: doc.status || 'active',
        role: doc.role || 'user'
      }));
      
      // Return clean array ONLY - no extra metadata
      return res.json(userList);
      
    } catch (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Error retrieving users." });
    }
  }
);

// GET /manager/users/:id - Get single user by ID
router.get("/users/:id",
  authManager,
  [ param("id").isMongoId() ],
  async (req, res) => {
    try {
      const id = req.params.id;
      const user = await users.findOne(
        { _id: new ObjectId(id) },
        { projection: { passwordHash: 0 } }
      );
      
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Return single user object in array format for consistency
      const userData = {
        id: user._id.toString(),
        uuid: user.uuid,
        fullName: user.fullName || 'N/A',
        email: user.email || 'N/A',
        idNumber: decryptField(user.idNumber) || 'N/A',
        accountNumber: decryptField(user.accountNumber) || 'N/A',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        status: user.status || 'active',
        role: user.role || 'user'
      };

      return res.json([userData]); // Return as array with single item
      
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error retrieving user." });
    }
  }
);

// DELETE /manager/users/:id
router.delete("/users/:id",
  authManager,
  [ param("id").isMongoId() ],
  async (req, res) => {
    try {
      const id = req.params.id;
      const result = await users.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      
      return res.json({ message: "User deleted successfully." });
      
    } catch (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Error deleting user." });
    }
  }
);

export default router;