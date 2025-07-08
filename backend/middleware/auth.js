const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user || !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user not found",
      })
    }

    req.userId = decoded.userId
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      })
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token",
    })
  }
}

module.exports = { authenticateToken }
