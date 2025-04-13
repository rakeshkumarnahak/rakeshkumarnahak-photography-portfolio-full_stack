// api/index.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import photoRoutes from "../routes/photos.js";
import authRoutes from "../routes/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connect only once (important for serverless)
let isConnected = false;
const connectToDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins or set your frontend domain
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Photography Portfolio API");
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Photography Portfolio API" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Export handler for Vercel
export default async function handler(req, res) {
  await connectToDB();
  return app(req, res); // let Express handle the request
}
