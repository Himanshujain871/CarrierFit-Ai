const mongoose = require('mongoose');

const interviewPrepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    questions: [
      {
        id: Number,
        category: String,
        question: String,
        purpose: String,
        sampleAnswer: String,
        keyPointsToMention: [String],
        difficulty: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
