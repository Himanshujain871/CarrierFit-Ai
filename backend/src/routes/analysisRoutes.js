const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  runAnalysis,
  getUserAnalyses,
  getAnalysisById,
} = require('../controllers/analysisController');

router.post('/run', protect, runAnalysis);
router.get('/user', protect, getUserAnalyses);
router.get('/:id', protect, getAnalysisById);

module.exports = router;
