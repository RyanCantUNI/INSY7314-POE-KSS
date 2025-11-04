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

// GET /manager/users/:id
router.get("/users/:id",
  authManager,
  [
    param("id").isMongoId()
  ],
  async (req, res) => {
    const id = req.params.id;
    try {
      const doc = await users.findOne({ _id: new (require("mongodb")).ObjectId(id) }, { projection: { passwordHash: 0 } });
      if (!doc) return res.status(404).json({ message: "User not found" });

      return res.json({
        id: doc._id,
        uuid: doc.uuid,
        fullName: doc.fullName,
        email: doc.email,
        idNumber: decryptField(doc.idNumber),
        accountNumber: decryptField(doc.accountNumber),
        createdAt: doc.createdAt,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT /manager/users/:id  -> update allowed fields (manager only)
router.put("/users/:id",
  authManager,
  [
    param("id").isMongoId(),
    body("fullName").optional().matches(/^[A-Za-z\s\-']{3,50}$/),
    body("email").optional().isEmail().normalizeEmail(),
    body("idNumber").optional().matches(/^[0-9]{6,13}$/),
    body("accountNumber").optional().matches(/^[0-9]{6,15}$/),
    body("password").optional().isStrongPassword({ minLength: 8, minNumbers: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid input", errors: errors.array() });

    const id = req.params.id;
    const update = {};
    if (req.body.fullName) update.fullName = req.body.fullName;
    if (req.body.email) update.email = req.body.email;
    if (req.body.idNumber) update.idNumber = encryptField(req.body.idNumber);
    if (req.body.accountNumber) update.accountNumber = encryptField(req.body.accountNumber);
    if (req.body.password) update.passwordHash = await bcrypt.hash(req.body.password, PASSWORD_SALT_ROUNDS);

    if (Object.keys(update).length === 0) return res.status(400).json({ message: "Nothing to update" });

    try {
      const result = await users.updateOne({ _id: new (require("mongodb")).ObjectId(id) }, { $set: update });
      if (result.matchedCount === 0) return res.status(404).json({ message: "User not found" });
      return res.json({ message: "Updated" });
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