// Get all users - returns array for frontend
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
      // Get total count for pagination
      const totalUsers = await users.countDocuments({});
      const totalPages = Math.ceil(totalUsers / limit);
      
      const cursor = users.find({}, { projection: { passwordHash: 0 } }).skip(skip).limit(limit);
      const docs = await cursor.toArray();
      
      // Transform data for frontend HTML table
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
      
      // Return as array with pagination info
      return res.json({
        success: true,
        data: userList, // This is the array frontend needs
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
      
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        success: false,
        message: "Server error" 
      });
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
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }
      
      return res.json({ 
        success: true,
        message: "User deleted successfully",
        deletedId: id // Frontend can use this to update UI
      });
      
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        success: false,
        message: "Server error" 
      });
    }
  }
);

export default router;