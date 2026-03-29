require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { auth } = require("./controller/Auth");
const chatRoutes = require("./Routes/chat");
const { Server } = require("socket.io");
const http = require("http");


const SECRET_KEY = process.env.JWT_SECRET;
require("./config/database").connect();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));
// Test route
app.get("/", (req, res) => {
  res.send("Server is working");
});
app.post("/test", (req, res) => {
  console.log("Test route working");
  res.send("OK");
});
// Register
app.post("/register", async (req, res) => {
  console.log("Register route hit");
  console.log("Request body:", req.body);
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
  console.error("Register Error:", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
  });
// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful",token: token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
app.get("/dashboard", auth, (req, res) => {
    res.json({
        message: "Welcome to Dashboard",
        user: req.user
    });
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend port
    methods: ["GET", "POST"]
  }
});
// Store online users
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online users:", onlineUsers);
  });

  // Send message event
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {

    const receiverSocket = onlineUsers[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        senderId,
        message
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove disconnected user
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});
server.listen(PORT, () => {
  console.log(`Server running with Socket.io on http://localhost:${PORT}`);
});
