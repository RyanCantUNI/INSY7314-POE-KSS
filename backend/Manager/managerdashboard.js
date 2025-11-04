//Get all users
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
      // Decrypt PII for manager view
      const results = docs.map(doc => ({
        id: doc._id,
        uuid: doc.uuid,
        fullName: doc.fullName,
        email: doc.email,
        idNumber: decryptField(doc.idNumber),
        accountNumber: decryptField(doc.accountNumber),
        createdAt: doc.createdAt,
      }));
      return res.json({ page, limit, results });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
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
      const result = await users.deleteOne({ _id: new (require("mongodb")).ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ message: "User not found" });
      return res.json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// Export router
export default router;