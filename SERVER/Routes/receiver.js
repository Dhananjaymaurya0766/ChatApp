//  Get all users except current
const User = require("../models/User");
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id }
    }).select("_id name email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});