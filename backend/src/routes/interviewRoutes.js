const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getInterviewPrepByAnalysis } = require('../controllers/interviewController');

router.get('/analysis/:analysisId', protect, getInterviewPrepByAnalysis);

module.exports = router;
