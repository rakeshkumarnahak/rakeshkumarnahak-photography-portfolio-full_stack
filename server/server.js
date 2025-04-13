import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import photoRoutes from "./routes/photos.js";
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}``);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Photography Portfolio API");
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Photography Portfolio API" });
});
