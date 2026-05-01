import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS fix
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Stock Sentiment Analysis API" });
});

// Public route
app.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});

// Protected route
app.use("/analyze", requireAuth(), analyzeRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error("Auth Error:", err);

  if (err.status === 401) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must be signed in",
      code: "auth_required"
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});