const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      default: 'Target Role',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    scoreBreakdown: {
      skillMatchScore: Number,
      experienceScore: Number,
      atsScore: Number,
      overallMatchScore: Number,
    },
    skills: {
      matchedSkills: [String],
      missingSkills: {
        critical: [String],
        recommended: [String],
        optional: [String],
      },
      resumeSkills: [String],
      jobSkills: [String],
    },
    strengths: [String],
    weaknesses: [String],
    atsFeedback: [String],
    tailoredSummary: String,
    bulletImprovements: [
      {
        original: String,
        improved: String,
        starBreakdown: {
          situation: String,
          task: String,
          action: String,
          result: String,
        },
        keyAddition: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', analysisSchema);
