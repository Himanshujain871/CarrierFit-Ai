import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import MatchGauge from '../components/MatchGauge';
import SkillBadge from '../components/SkillBadge';
import StarCard from '../components/StarCard';
import FlashCard from '../components/FlashCard';
import {
  FileText, UploadCloud, Sparkles, Target, AlertCircle,
  CheckCircle2, ArrowRight, Wand2, MessageSquare, RefreshCw
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState(
    `We are seeking a Senior Full-Stack Software Engineer with 4+ years of experience building web applications. 
    Required skills: React, Node.js, Express.js, JavaScript, TypeScript, MongoDB, REST API design, Docker, microservices architecture, and CI/CD pipelines. 
    Strong experience with AWS, unit testing (Jest/Vitest), Redis caching, and Agile methodologies is highly preferred.`
  );
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('match'); // match, improver, interview
  const [error, setError] = useState('');

  // Sample Resume Preloader for instant 1-click test drive
  const loadSampleResume = () => {
    const sample = `ALEX MORGAN
Full-Stack Software Engineer | alex.morgan@email.com | GitHub: alexmorgan

PROFESSIONAL SUMMARY:
Experienced Software Developer with 4 years of experience building modern web applications using React, JavaScript, Node.js, and MongoDB. Passionate about API design and clean code.

SKILLS:
Languages & Frameworks: JavaScript, HTML5, CSS3, React, Node.js, Express.js, Python, SQL, Git
Databases: MongoDB, PostgreSQL
Tools & Practices: Docker, REST API, Agile/Scrum, Jest, Linux

WORK EXPERIENCE:
Software Engineer | NextTech Solutions (2022 - Present)
• Developed responsive user interface components using React and Tailwind CSS.
• Built RESTful APIs using Node.js and Express to handle user data.
• Worked with MongoDB to create schemas and query data.
• Collaborated with team members to resolve software bugs and improve application speed.

Junior Developer | CloudSystems Inc (2020 - 2022)
• Wrote unit tests for frontend modules using Jest.
• Assisted in migrating legacy code to modern JavaScript standards.
• Participated in daily Agile standups and sprint retrospectives.

EDUCATION:
B.S. in Computer Science | State University (2020)`;

    setResumeText(sample);
  };

  useEffect(() => {
    if (id) {
      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const res = await API.get('/analysis/' + id);
          if (res.data.success) {
            const data = res.data.data;
            // Normalise into the same shape as the runAnalysis response so all resolvers work
            setAnalysisResult({
              success: true,
              analysis: data,
              interviewPrep: data.interviewPrep || { questions: [] },
            });
            setJobTitle(data.jobTitle || 'Target Position');
          }
        } catch (err) {
          console.error('Failed to load analysis:', err);
          setError('Failed to load analysis details. It might have been deleted.');
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setError('');

    if (!file && !resumeText.trim()) {
      setError('Please upload a PDF/DOCX resume file or click "Load Sample Resume".');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description.');
      return;
    }

    setLoading(true);
    try {
      let uploadedResumeId = null;
      let textToUse = resumeText;

      // 1. If file uploaded, upload to backend express API first
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await API.post('/resumes/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data.success) {
          uploadedResumeId = uploadRes.data.resume._id;
          textToUse = uploadRes.data.resume.rawText;
        }
      }

      // 2. Run analysis via Express Gateway -> Python FastAPI
      const res = await API.post('/analysis/run', {
        resumeId: uploadedResumeId,
        resumeText: textToUse,
        jobDescription: jobDescription,
        jobTitle: jobTitle,
      });

      if (res.data.success) {
        setAnalysisResult(res.data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to complete analysis. Ensure microservices are running.');
    } finally {
      setLoading(false);
    }
  };

  // Safe Property Resolvers
  const analysisObj = analysisResult?.analysis || {};
  const scoreBreakdown = analysisObj?.scoreBreakdown || analysisObj?.score_breakdown || {};
  const skillsObj = analysisObj?.skills || {};
  const matchedSkillsList = skillsObj?.matchedSkills || skillsObj?.matched_skills || [];
  const missingSkillsObj = skillsObj?.missingSkills || skillsObj?.missing_skills || {};
  const criticalMissingList = missingSkillsObj?.critical || [];
  const recommendedMissingList = missingSkillsObj?.recommended || [];
  const bulletImprovementsList = analysisObj?.bulletImprovements || analysisObj?.bullet_improvements || [];
  // interviewPrep is attached at the top-level of the response (both run & getById)
  const interviewQuestionsList =
    analysisResult?.interviewPrep?.questions ||
    analysisResult?.data?.interviewPrep?.questions ||
    [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-indigo-400" />
              AI Resume & Job Match Analyzer
            </h1>
            <p className="text-slate-400 text-sm">
              Upload your resume document and paste the target job description to get instant transparent scores and AI suggestions.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Setup Section */}
          {!analysisResult && (
            <form onSubmit={handleRunAnalysis} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Resume Input */}
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" />
                      1. Upload Resume (PDF / DOCX)
                    </h3>
                    <button
                      type="button"
                      onClick={loadSampleResume}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Load Sample Resume
                    </button>
                  </div>

                  {/* File Drag Drop */}
                  <div className="border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-2xl p-6 text-center space-y-3 bg-slate-900/40 transition-all">
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
                    <div>
                      <label className="cursor-pointer text-sm font-bold text-indigo-400 hover:text-indigo-300">
                        Choose PDF or DOCX file
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-500 mt-1">Maximum size 10MB</p>
                    </div>
                    {file && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected: {file.name}
                      </div>
                    )}
                  </div>

                  {/* Textarea Fallback */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">Or Paste Resume Text</label>
                    <textarea
                      rows={7}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste raw resume text here..."
                      className="w-full p-3.5 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Right: Job Description Input */}
                <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      2. Target Job Requirements
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Target Role Title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior Full-Stack Engineer"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">Job Description Text</label>
                      <textarea
                        rows={9}
                        required
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste target job description requirements, qualifications, and stack..."
                        className="w-full p-3.5 rounded-xl glass-input text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-white" />
                        Running AI NLP Engine...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-cyan-300" />
                        Run Match & Improvement Analysis
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Analysis Results Display View */}
          {analysisResult && (
            <div className="space-y-8 animate-fadeIn">
              {/* Top Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target:</span>
                  <span className="text-sm font-bold text-white bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                    {analysisObj.jobTitle || 'Target Position'}
                  </span>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('match')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'match'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Match Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('improver')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'improver'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    STAR Bullet Improver
                  </button>
                  <button
                    onClick={() => setActiveTab('interview')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'interview'
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Interview Q&A Deck
                  </button>
                </div>

                <button
                  onClick={() => setAnalysisResult(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Reset / New Analysis
                </button>
              </div>

              {/* TAB 1: Match Score & Skill Breakdown */}
              {activeTab === 'match' && (
                <div className="space-y-6">
                  {/* Gauge & Score Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Overall Resume Match Score
                      </h3>
                      <MatchGauge score={analysisObj.matchScore || analysisObj.match_score || 75} size={190} />
                    </div>

                    <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Transparent Matching Metric Breakdown
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-xs text-slate-400 font-medium">Skill Match %</span>
                          <span className="block text-2xl font-bold text-indigo-400">
                            {scoreBreakdown.skillMatchScore ?? scoreBreakdown.skill_match_score ?? 70}%
                          </span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-xs text-slate-400 font-medium">Experience Level</span>
                          <span className="block text-2xl font-bold text-violet-400">
                            {scoreBreakdown.experienceScore ?? scoreBreakdown.experience_score ?? 80}%
                          </span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                          <span className="text-xs text-slate-400 font-medium">ATS Formatting</span>
                          <span className="block text-2xl font-bold text-emerald-400">
                            {scoreBreakdown.atsScore ?? scoreBreakdown.ats_score ?? 85}%
                          </span>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Resume Strengths
                          </span>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {(analysisObj.strengths || []).map((s, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                            Areas for Improvement
                          </span>
                          <ul className="space-y-1 text-xs text-slate-300">
                            {(analysisObj.weaknesses || []).map((w, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Matrix */}
                  <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Skill Alignment & Gap Matrix
                    </h3>

                    <div className="space-y-4">
                      {/* Matched Skills */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-emerald-400">
                          Matched Skills ({matchedSkillsList.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {matchedSkillsList.map((sk, idx) => (
                            <SkillBadge key={idx} name={sk} type="matched" />
                          ))}
                        </div>
                      </div>

                      {/* Critical Missing Skills */}
                      {criticalMissingList.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-rose-400">
                            Critical Missing Requirements ({criticalMissingList.length})
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {criticalMissingList.map((sk, idx) => (
                              <SkillBadge key={idx} name={sk} type="critical" />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Skills */}
                      {recommendedMissingList.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-amber-400">
                            Recommended Additions ({recommendedMissingList.length})
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {recommendedMissingList.map((sk, idx) => (
                              <SkillBadge key={idx} name={sk} type="recommended" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STAR Bullet Improver View */}
              {activeTab === 'improver' && (
                <div className="space-y-6">
                  {/* Executive Summary */}
                  {(analysisObj.tailoredSummary || analysisObj.tailored_summary) && (
                    <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-cyan-400" />
                        AI Recommended Executive Summary
                      </span>
                      <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        "{analysisObj.tailoredSummary || analysisObj.tailored_summary}"
                      </p>
                    </div>
                  )}

                  {/* Bullet Rewrites */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        STAR Method Bullet Point Optimizer
                      </h3>
                      <button
                        onClick={() => navigate(`/generator/${id}`)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> Generate PDF Resume
                      </button>
                    </div>
                    <div className="space-y-4">
                      {bulletImprovementsList.map((item, idx) => (
                        <StarCard key={idx} item={item} index={idx} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Interview Q&A Flashcards View */}
              {activeTab === 'interview' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-400" />
                        Personalized Interview Preparation Deck
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Tailored specifically to your resume background and the target {analysisObj.jobTitle || 'Target Position'} position.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/interview/room/' + id)}
                      className="shrink-0 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20"
                    >
                      <MessageSquare className="w-4 h-4" /> Start Voice Interview
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interviewQuestionsList.map((q, idx) => (
                      <FlashCard key={q.id || idx} q={q} index={idx} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
