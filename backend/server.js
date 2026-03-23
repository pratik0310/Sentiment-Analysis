import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express"; // Updated import
import analyzeRoute from "./routes/analyze.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Configure CORS properly
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add Clerk middleware to all routes
app.use(clerkMiddleware());

// Public route for testing
app.get("/", (req, res) => {
  res.json({ message: "Stock Sentiment Analysis API" });
});

// Public route to check auth status
app.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint" });
});

// Protected route - require authentication for analyze
app.use("/analyze", requireAuth(), analyzeRoute);

// Error handling middleware for authentication errors
app.use((err, req, res, next) => {
  console.error("Auth Error:", err);
  
  if (err.status === 401) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "You must be signed in to access this resource",
      code: "auth_required"
    });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error" 
  });
});

console.log("✅ Gemini API Keys loaded");
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);