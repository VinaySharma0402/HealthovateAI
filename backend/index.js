import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import health from "./routes/health.route.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser"; // Import cookie-parser for reading cookies
import requireAuth from "./middleware/auth.js"; // Import the auth middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Define PORT

// Middlewares
app.use(cors({ origin: 'http://localhost:4000', credentials: true })); // Allow cross-origin requests
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // Parse cookies from incoming requests

// Routes
app.use("/api/healthcare", health);

// Add your authenticated route to return user info
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user }); // Send back the decoded user from the token
});

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
