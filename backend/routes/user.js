const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-otp -refreshTokens -loginAttempts -lockUntil")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    body("dateOfBirth").optional().isISO8601().withMessage("Please provide a valid date of birth"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, dateOfBirth } = req.body
      const updateData = {}

      if (name) updateData.name = name
      if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth)

      const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true, runValidators: true }).select(
        "-otp -refreshTokens -loginAttempts -lockUntil",
      )

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  },
)

// Delete user account
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.error("Delete account error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

module.exports = router
