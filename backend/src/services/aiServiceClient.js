const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const getAIServiceURL = () => {
  return process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
};

/**
 * Extract raw text from file via Python AI Service
 */
const extractTextFromFile = async (filePath, originalName) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), originalName);

    const response = await axios.post(`${getAIServiceURL()}/extract-text`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error('Error calling AI Service /extract-text:', error.message);
    throw new Error(`AI Service text extraction failed: ${error.message}`);
  }
};

/**
 * Analyze resume against job description via Python AI Service
 */
const analyzeResumeAndJob = async (resumeText, jobDescription, jobTitle = 'Target Role') => {
  try {
    const response = await axios.post(
      `${getAIServiceURL()}/analyze`,
      {
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
      },
      { timeout: 20000 }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling AI Service /analyze:', error.message);
    throw new Error(`AI Service analysis failed: ${error.message}`);
  }
};

/**
 * Improve resume bullet points and section content via Python AI Service
 */
const improveResumeContent = async (resumeText, jobDescription, targetRole = 'Target Role') => {
  try {
    const response = await axios.post(
      `${getAIServiceURL()}/improve-resume`,
      {
        resume_text: resumeText,
        job_description: jobDescription,
        target_role: targetRole,
      },
      { timeout: 20000 }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling AI Service /improve-resume:', error.message);
    throw new Error(`AI Service resume improver failed: ${error.message}`);
  }
};

/**
 * Generate tailored interview preparation Q&A cards via Python AI Service
 */
const generateInterviewPrepCards = async (resumeText, jobDescription, jobTitle = 'Target Role') => {
  try {
    const response = await axios.post(
      `${getAIServiceURL()}/generate-interview-prep`,
      {
        resume_text: resumeText,
        job_description: jobDescription,
        job_title: jobTitle,
      },
      { timeout: 20000 }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling AI Service /generate-interview-prep:', error.message);
    throw new Error(`AI Service interview prep generation failed: ${error.message}`);
  }
};

module.exports = {
  extractTextFromFile,
  analyzeResumeAndJob,
  improveResumeContent,
  generateInterviewPrepCards,
};
