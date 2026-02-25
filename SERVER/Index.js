require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { auth } = require("./controller/Auth");
const chatRoutes = require("./Routes/chat");

const SECRET_KEY = process.env.JWT_SECRET;
require("./config/database").connect();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/chat", chatRoutes);

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

app.get("/dashboard", auth, (req, res) => {
    res.json({
        message: "Welcome to Dashboard",
        user: req.user
    });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
