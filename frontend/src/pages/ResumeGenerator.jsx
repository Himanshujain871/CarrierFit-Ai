import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { Download, FileText, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ResumeGenerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysisObj, setAnalysisObj] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await API.get(`/analysis/${id}`);
        if (res.data.success) {
          setAnalysisObj(res.data.data.analysis);
        }
      } catch (err) {
        console.error('Failed to load analysis for resume generation', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnalysis();
  }, [id]);

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;
    setDownloading(true);

    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right in mm
      filename: `AI_Enhanced_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(resumeRef.current).save().then(() => {
      setDownloading(false);
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Resume Data...</div>;
  }

  if (!analysisObj) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        No analysis data found. <button onClick={() => navigate('/dashboard')} className="ml-4 text-indigo-400">Go Back</button>
      </div>
    );
  }

  // Extract improvements and summary
  const summary = analysisObj.tailoredSummary || analysisObj.tailored_summary || "Results-driven professional with strong technical expertise.";
  const improvements = analysisObj.bulletImprovements || analysisObj.bullet_improvements || [];
  
  // Fake basic layout based on standard ATS templates
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 flex flex-col items-center">
          
          <div className="w-full max-w-4xl flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(`/analyzer/${id}`)}
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {downloading ? 'Generating PDF...' : 'Download ATS PDF'}
            </button>
          </div>

          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 w-full max-w-4xl">
            <div className="bg-slate-800/50 p-3 rounded-xl mb-4 text-xs text-emerald-400 flex items-center justify-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> This resume layout is optimized for ATS readability.
            </div>

            {/* The Actual PDF Container (Styled to look like A4 white paper) */}
            <div className="overflow-x-auto pb-4">
              <div 
                ref={resumeRef} 
                className="bg-white mx-auto shadow-2xl p-8 sm:p-12 text-slate-900"
                style={{ width: '800px', minHeight: '1130px', fontFamily: 'Arial, sans-serif' }}
              >
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                  <h1 className="text-3xl font-extrabold uppercase tracking-widest text-slate-900 mb-2">Alex Morgan</h1>
                  <p className="text-sm text-slate-700">
                    alex.morgan@email.com | (555) 123-4567 | linkedin.com/in/alexmorgan | github.com/alexmorgan
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">Professional Summary</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {summary}
                  </p>
                </div>

                {/* Technical Skills */}
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">Technical Skills</h2>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p><span className="font-bold">Languages & Frameworks:</span> JavaScript, React, Node.js, Express.js, Python, SQL, HTML/CSS</p>
                    <p><span className="font-bold">Databases & Cloud:</span> MongoDB, PostgreSQL, AWS, Docker</p>
                    <p><span className="font-bold">Tools & Methodologies:</span> Git, REST API, Agile/Scrum, CI/CD</p>
                  </div>
                </div>

                {/* Professional Experience */}
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">Professional Experience</h2>
                  
                  {/* Job 1 */}
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">NextTech Solutions</h3>
                      <span className="text-xs font-semibold text-slate-600">2022 – Present</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-sm italic text-slate-700">Software Engineer</h4>
                      <span className="text-xs text-slate-600">San Francisco, CA</span>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                      {improvements.map((imp, idx) => (
                        <li key={idx}>{imp.improved}</li>
                      ))}
                      {improvements.length === 0 && (
                        <li>Developed responsive user interface components using React and Tailwind CSS.</li>
                      )}
                    </ul>
                  </div>

                  {/* Job 2 */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900">CloudSystems Inc</h3>
                      <span className="text-xs font-semibold text-slate-600">2020 – 2022</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-sm italic text-slate-700">Junior Developer</h4>
                      <span className="text-xs text-slate-600">Austin, TX</span>
                    </div>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
                      <li>Wrote unit tests for frontend modules using Jest to prevent regression bugs.</li>
                      <li>Assisted in migrating legacy code to modern JavaScript standards, improving maintainability.</li>
                      <li>Participated in daily Agile standups and sprint retrospectives to ensure on-time delivery.</li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">Education</h2>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">State University</h3>
                    <span className="text-xs font-semibold text-slate-600">2020</span>
                  </div>
                  <h4 className="text-sm italic text-slate-700">Bachelor of Science in Computer Science</h4>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
