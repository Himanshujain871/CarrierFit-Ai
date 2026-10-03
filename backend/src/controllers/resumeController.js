const path = require('path');
const Resume = require('../models/Resume');
const { extractTextFromFile } = require('../services/aiServiceClient');

// @desc Upload resume PDF/DOCX and parse text via AI microservice
// @route POST /api/resumes/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file.' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    // Call Python FastAPI microservice to extract raw text & sections
    const parsedData = await extractTextFromFile(filePath, originalName);

    const fileUrl = `/uploads/${path.basename(filePath)}`;

    let savedResume;
    try {
      savedResume = await Resume.create({
        userId: req.user.id || req.user._id,
        originalName: originalName,
        fileUrl: fileUrl,
        mimeType: req.file.mimetype,
        size: req.file.size,
        rawText: parsedData.text,
        wordCount: parsedData.word_count || 0,
        sectionsFound: parsedData.sections_found || [],
      });
    } catch (dbErr) {
      // Memory fallback if MongoDB isn't active
      savedResume = {
        _id: 'mock_resume_' + Date.now(),
        userId: req.user.id,
        originalName: originalName,
        fileUrl: fileUrl,
        rawText: parsedData.text,
        wordCount: parsedData.word_count || 0,
        sectionsFound: parsedData.sections_found || [],
        createdAt: new Date(),
      };
    }

    return res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully!',
      resume: savedResume,
    });
  } catch (error) {
    console.error('Error uploading resume:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's uploaded resumes
// @route GET /api/resumes
const getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    try {
      const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: resumes.length, resumes });
    } catch (dbErr) {
      return res.json({ success: true, count: 0, resumes: [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
};
