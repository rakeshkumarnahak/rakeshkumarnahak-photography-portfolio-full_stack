import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";
const ACCESS_TOKEN_EXPIRY = "120m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const authService = {
  // Generate access token
  generateAccessToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  },

  // Generate refresh token
  generateRefreshToken: (userId) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  },

  // Verify access token
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Verify refresh token
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Hash password
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  // Compare password
  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },

  // Save refresh token to user
  saveRefreshToken: async (userId, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await User.findByIdAndUpdate(userId, {
      $push: {
        refreshTokens: {
          token,
          expiresAt,
        },
      },
    });
  },

  // Remove refresh token
  removeRefreshToken: async (userId, token) => {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        refreshTokens: { token },
      },
    });
  },

  // Clean expired refresh tokens
  cleanExpiredTokens: async (userId) => {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        refreshTokens: {
          expiresAt: { $lt: new Date() },
        },
      },
    });
  },
};
