import { authService } from "../services/authService.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = authService.verifyAccessToken(token);
    if (!decoded) {
      return res
        .status(403)
        .json({ message: "Invalid or expired access token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res, next) => {
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

    // Generate new access token
    const newAccessToken = authService.generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
