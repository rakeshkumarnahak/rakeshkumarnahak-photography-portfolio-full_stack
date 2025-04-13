import express from "express";
import User from "../models/User.js";
import { authService } from "../services/authService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate tokens
    const accessToken = authService.generateAccessToken(user._id);
    const refreshToken = authService.generateRefreshToken(user._id);

    // Save refresh token
    await authService.saveRefreshToken(user._id, refreshToken);

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await authService.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = authService.generateAccessToken(user._id);
    const refreshToken = authService.generateRefreshToken(user._id);

    // Save refresh token
    await authService.saveRefreshToken(user._id, refreshToken);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Refresh access token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = authService.verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Check if refresh token exists in user's tokens
    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": refreshToken,
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = authService.generateAccessToken(decoded.userId);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout user
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.removeRefreshToken(req.userId, refreshToken);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
