const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const InterviewPrep = require('../models/InterviewPrep');
const {
  analyzeResumeAndJob,
  improveResumeContent,
  generateInterviewPrepCards,
} = require('../services/aiServiceClient');

// In-memory cache store for offline/demo testing if Mongo is unavailable
const memoryAnalyses = [];

// @desc Run comprehensive job match analysis & resume rewrite
// @route POST /api/analysis/run
const runAnalysis = async (req, res) => {
  try {
    const { resumeId, resumeText, jobDescription, jobTitle } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ success: false, message: 'Target Job Description is required.' });
    }

    let textToAnalyze = resumeText;
    let validResumeId = resumeId;

    if (!textToAnalyze && resumeId) {
      try {
        const foundResume = await Resume.findById(resumeId);
        if (foundResume) {
          textToAnalyze = foundResume.rawText;
        }
      } catch (err) {
        console.warn('Could not fetch resume by ID:', err.message);
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({ success: false, message: 'Please upload a resume or provide resume text to analyze.' });
    }

    const title = jobTitle || 'Target Position';

    // 1. Call AI Microservice for Transparent Job Match analysis
    const matchData = await analyzeResumeAndJob(textToAnalyze, jobDescription, title);

    // 2. Call AI Microservice for STAR Resume Bullet Improver
    const improverData = await improveResumeContent(textToAnalyze, jobDescription, title);

    // 3. Call AI Microservice for Personalized Interview Preparation Q&A cards
    const interviewData = await generateInterviewPrepCards(textToAnalyze, jobDescription, title);

    // Normalize snake_case responses from Python AI service into clean camelCase
    const normalizedSkills = {
      matchedSkills: matchData.skills?.matched_skills || matchData.skills?.matchedSkills || [],
      missingSkills: {
        critical: matchData.skills?.missing_skills?.critical || matchData.skills?.missingSkills?.critical || [],
        recommended: matchData.skills?.missing_skills?.recommended || matchData.skills?.missingSkills?.recommended || [],
        optional: matchData.skills?.missing_skills?.optional || matchData.skills?.missingSkills?.optional || [],
      },
      resumeSkills: matchData.skills?.resume_skills || matchData.skills?.resumeSkills || [],
      jobSkills: matchData.skills?.job_skills || matchData.skills?.jobSkills || [],
    };

    const normalizedBreakdown = {
      skillMatchScore: matchData.score_breakdown?.skill_match_score ?? matchData.score_breakdown?.skillMatchScore ?? 70,
      experienceScore: matchData.score_breakdown?.experience_score ?? matchData.score_breakdown?.experienceScore ?? 80,
      atsScore: matchData.score_breakdown?.ats_score ?? matchData.score_breakdown?.atsScore ?? 85,
      overallMatchScore: matchData.score_breakdown?.overall_match_score ?? matchData.score_breakdown?.overallMatchScore ?? matchData.match_score ?? 75,
    };

    const rawBullets = improverData.bullet_improvements || improverData.bulletImprovements || [];
    const normalizedBullets = rawBullets.map((b) => ({
      original: b.original || '',
      improved: b.improved || '',
      starBreakdown: {
        situation: b.star_breakdown?.situation || b.starBreakdown?.situation || '',
        task: b.star_breakdown?.task || b.starBreakdown?.task || '',
        action: b.star_breakdown?.action || b.starBreakdown?.action || '',
        result: b.star_breakdown?.result || b.starBreakdown?.result || '',
      },
      keyAddition: b.key_addition || b.keyAddition || '',
    }));

    const normalizedQuestions = (interviewData.questions || []).map((q) => ({
      id: q.id,
      category: q.category || 'Technical',
      question: q.question || '',
      purpose: q.purpose || '',
      sampleAnswer: q.sample_answer || q.sampleAnswer || '',
      keyPointsToMention: q.key_points_to_mention || q.keyPointsToMention || [],
      difficulty: q.difficulty || 'Medium',
    }));

    let savedAnalysis;
    let savedPrep;

    try {
      savedAnalysis = await Analysis.create({
        userId: req.user.id || req.user._id,
        resumeId: validResumeId || '65d000000000000000000000',
        jobTitle: title,
        jobDescription: jobDescription,
        matchScore: matchData.match_score,
        scoreBreakdown: normalizedBreakdown,
        skills: normalizedSkills,
        strengths: matchData.strengths || [],
        weaknesses: matchData.weaknesses || [],
        atsFeedback: matchData.ats_feedback || matchData.atsFeedback || [],
        tailoredSummary: improverData.tailored_summary || improverData.tailoredSummary || '',
        bulletImprovements: normalizedBullets,
      });

      savedPrep = await InterviewPrep.create({
        userId: req.user.id || req.user._id,
        analysisId: savedAnalysis._id,
        jobTitle: title,
        questions: normalizedQuestions,
      });
    } catch (dbErr) {
      const mockAnalysisId = 'analysis_' + Date.now();
      savedAnalysis = {
        _id: mockAnalysisId,
        userId: req.user.id,
        jobTitle: title,
        jobDescription: jobDescription,
        matchScore: matchData.match_score || 75,
        scoreBreakdown: normalizedBreakdown,
        skills: normalizedSkills,
        strengths: matchData.strengths || [],
        weaknesses: matchData.weaknesses || [],
        atsFeedback: matchData.ats_feedback || matchData.atsFeedback || [],
        tailoredSummary: improverData.tailored_summary || improverData.tailoredSummary || '',
        bulletImprovements: normalizedBullets,
        createdAt: new Date(),
      };
      savedPrep = {
        _id: 'prep_' + Date.now(),
        analysisId: mockAnalysisId,
        jobTitle: title,
        questions: normalizedQuestions,
      };
      memoryAnalyses.unshift(savedAnalysis);
    }

    return res.status(201).json({
      success: true,
      analysis: savedAnalysis,
      interviewPrep: savedPrep,
      improver: improverData,
    });
  } catch (error) {
    console.error('Error running analysis:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get user's analysis history
// @route GET /api/analysis/user
const getUserAnalyses = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    try {
      const history = await Analysis.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: history.length, data: history });
    } catch (dbErr) {
      return res.json({ success: true, count: memoryAnalyses.length, data: memoryAnalyses });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single analysis detail (with joined interview prep)
// @route GET /api/analysis/:id
const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const analysis = await Analysis.findById(id);
      if (!analysis) {
        const memMatch = memoryAnalyses.find((a) => a._id === id);
        if (memMatch) return res.json({ success: true, data: memMatch });
        return res.status(404).json({ success: false, message: 'Analysis not found' });
      }

      // Fetch the linked InterviewPrep to attach questions
      let interviewPrep = null;
      try {
        interviewPrep = await InterviewPrep.findOne({ analysisId: analysis._id });
      } catch (prepErr) {
        console.warn('Could not fetch interview prep for analysis:', prepErr.message);
      }

      const responseData = analysis.toObject();
      responseData.interviewPrep = interviewPrep
        ? { questions: interviewPrep.questions, jobTitle: interviewPrep.jobTitle }
        : { questions: [] };

      return res.json({ success: true, data: responseData });
    } catch (dbErr) {
      const memMatch = memoryAnalyses.find((a) => a._id === id);
      if (memMatch) return res.json({ success: true, data: memMatch });
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  runAnalysis,
  getUserAnalyses,
  getAnalysisById,
};
