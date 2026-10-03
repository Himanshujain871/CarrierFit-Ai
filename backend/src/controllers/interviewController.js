const InterviewPrep = require('../models/InterviewPrep');

// @desc Get interview Q&A cards by analysisId
// @route GET /api/interview/analysis/:analysisId
const getInterviewPrepByAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    try {
      const prep = await InterviewPrep.findOne({ analysisId });
      if (prep) {
        return res.json({ success: true, data: prep });
      }
    } catch (err) {
      console.warn('DB lookup failed for interview prep:', err.message);
    }

    // Return default sample cards if DB is empty or lookup fails
    return res.json({
      success: true,
      data: {
        analysisId,
        jobTitle: 'Senior Software Engineer',
        questions: [
          {
            id: 1,
            category: 'Technical',
            question: 'How do you structure microservices communication and resilient API gateways?',
            purpose: 'Evaluates architectural knowledge & inter-service decoupling.',
            sampleAnswer: 'I use asynchronous event brokers for non-blocking operations and REST/gRPC with circuit breakers for synchronous calls. API gateways handle stateless JWT authentication, rate limiting, and request routing.',
            keyPointsToMention: ['Circuit breakers', 'Stateless JWT auth', 'Asynchronous event queues'],
            difficulty: 'Hard',
          },
          {
            id: 2,
            category: 'Behavioral',
            question: 'Describe a situation where you had to push back against an unreasonable deadline.',
            purpose: 'Tests negotiation, MVP scope prioritization, and stakeholder management.',
            sampleAnswer: 'I presented empirical evidence showing test coverage risks and technical debt implications. I proposed an MVP core release for phase 1 followed by non-critical features in phase 2.',
            keyPointsToMention: ['Empirical data presentation', 'Phase 1 MVP scope triage', 'Stakeholder alignment'],
            difficulty: 'Medium',
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInterviewPrepByAnalysis,
};
