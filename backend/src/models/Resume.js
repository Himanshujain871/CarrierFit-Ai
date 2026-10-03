const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    sectionsFound: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
