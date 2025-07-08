const express = require("express")
const { body, validationResult } = require("express-validator")
const Note = require("../models/Note")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get all notes for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Note.countDocuments({ userId: req.userId })

    res.status(200).json({
      success: true,
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get notes error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Create a new note
router.post(
  "/",
  authenticateToken,
  [body("text").trim().isLength({ min: 1, max: 1000 }).withMessage("Note text must be between 1 and 1000 characters")],
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

      const { text } = req.body

      const note = new Note({
        text,
        userId: req.userId,
      })

      await note.save()

      res.status(201).json({
        success: true,
        message: "Note created successfully",
        note,
      })
    } catch (error) {
      console.error("Create note error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  },
)

// Update a note
router.put(
  "/:id",
  authenticateToken,
  [body("text").trim().isLength({ min: 1, max: 1000 }).withMessage("Note text must be between 1 and 1000 characters")],
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

      const { text } = req.body
      const { id } = req.params

      const note = await Note.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { text },
        { new: true, runValidators: true },
      )

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        })
      }

      res.status(200).json({
        success: true,
        message: "Note updated successfully",
        note,
      })
    } catch (error) {
      console.error("Update note error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  },
)

// Delete a note
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOneAndUpdate({ _id: id, userId: req.userId }, { isDeleted: true }, { new: true })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    console.error("Delete note error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Get a specific note
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOne({ _id: id, userId: req.userId })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      })
    }

    res.status(200).json({
      success: true,
      note,
    })
  } catch (error) {
    console.error("Get note error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

module.exports = router
