const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Note text is required"],
      trim: true,
      maxlength: [1000, "Note cannot exceed 1000 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for user lookup
noteSchema.index({ userId: 1, isDeleted: 1 })

// Only return non-deleted notes by default
noteSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

module.exports = mongoose.model("Note", noteSchema)
