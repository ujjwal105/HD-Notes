const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { sendOTPEmail } = require("../utils/emailService");
const { generateOTP } = require("../utils/otpGenerator");

const router = express.Router();

// Rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 OTP requests per windowMs
  message: {
    success: false,
    message: "Too many OTP requests, please try again later.",
  },
});

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

// Validation middleware
const signupValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Please provide a valid date of birth"),
];

const signinValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("otp")
    .isLength({ min: 4, max: 6 })
    .withMessage("OTP must be 4-6 characters long"),
];

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

// Sign up route
router.post("/signup", otpLimiter, signupValidation, async (req, res) => {
  try {
    console.log("Signup request received:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, dateOfBirth } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists and is verified",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("Generated OTP:", otp, "for email:", email);

    if (user) {
      // Update existing unverified user
      user.name = name;
      user.dateOfBirth = new Date(dateOfBirth);
      user.otp = {
        code: otp,
        expiresAt: otpExpiresAt,
        attempts: 0,
      };
    } else {
      // Create new user
      user = new User({
        name,
        email,
        dateOfBirth: new Date(dateOfBirth),
        otp: {
          code: otp,
          expiresAt: otpExpiresAt,
          attempts: 0,
        },
      });
    }

    await user.save();
    console.log("User saved successfully");

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, name);
      console.log("OTP email sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the signup if email fails, but log it
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Verify OTP and complete signup
router.post("/verify-signup", signupValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, dateOfBirth, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    // Check OTP attempts
    if (user.otp.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: "Too many OTP attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    const isOTPValid = await user.verifyOTP(otp);
    if (!isOTPValid) {
      user.otp.attempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Complete user registration
    user.isVerified = true;
    user.otp = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Verify signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Request OTP for signin
router.post(
  "/request-signin-otp",
  otpLimiter,
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User not found or not verified",
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: "Account temporarily locked due to too many failed attempts",
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.otp = {
        code: otp,
        expiresAt: otpExpiresAt,
        attempts: 0,
      };

      await user.save();

      // Send OTP email
      try {
        await sendOTPEmail(email, otp, user.name);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP email. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
      });
    } catch (error) {
      console.error("Request signin OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Sign in route
router.post("/signin", loginLimiter, signinValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, otp, keepLoggedIn } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User not found or not verified",
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: "Account temporarily locked due to too many failed attempts",
      });
    }

    // Verify OTP
    const isOTPValid = await user.verifyOTP(otp);
    if (!isOTPValid) {
      await user.incLoginAttempts();
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    user.otp = undefined;
    await user.save();

    // Generate tokens
    const tokenExpiry = keepLoggedIn ? "30d" : "15m";
    const refreshTokenExpiry = keepLoggedIn ? "90d" : "7d";

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: tokenExpiry,
      }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
      {
        expiresIn: refreshTokenExpiry,
      }
    );

    // Save refresh token
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Refresh token route
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(
      (t) => t.token === refreshToken
    );
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from user's tokens
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      );
      const user = await User.findById(decoded.userId);

      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t.token !== refreshToken
        );
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
});

module.exports = router;
