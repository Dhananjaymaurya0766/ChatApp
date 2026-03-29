const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { auth } = require("../controller/Auth");
const User = require("../models/User");
const upload = require("../middleware/upload");

//Send Message

router.post("/send", auth ,upload.single("media"), async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { receiverId, message } = req.body;
    // if(!message && !req.file){
    //   return res.status(400).json({
    //     message: "Message or media required"
    //   });
    // }
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID missing" });
    }
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message: message || "",
      media: req.file ? req.file.filename : null
    });
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
});
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id }
    }).select("_id name email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users"
    });
  }
});

//Get Conversation
router.get("/:receiverId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;