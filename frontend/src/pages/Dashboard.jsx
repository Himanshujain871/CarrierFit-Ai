import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, FileSearch, Wand2, MessageSquare, ArrowRight, Activity, Award, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await API.get('/analysis/user');
        if (res.data.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load user history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const avgScore = history.length
    ? Math.round(history.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / history.length)
    : 78;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 space-y-8">
          {/* Candidate Welcome Banner */}
          <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Career Dashboard Active</span>
              </div>
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white">
                Welcome back, <span className="gradient-text">{user?.name || 'Candidate'}</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                Target Role: <span className="text-slate-200 font-semibold">{user?.targetJobTitle || 'Full-Stack Software Engineer'}</span>. Your resume job match metrics and tailored interview prep decks are updated in real-time.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to="/analyzer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
                >
                  <FileSearch className="w-4 h-4" />
                  Analyze New Resume
                </Link>
                <Link
                  to="/improver"
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-all border border-slate-700"
                >
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  STAR Bullet Optimizer
                </Link>
                <Link
                  to="/interview/demo"
                  className="px-5 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-all border border-slate-700"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Practice Interview Q&A
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Analyses Run</span>
                <span className="block text-2xl font-bold text-white">{history.length || 3}</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Average Match Score</span>
                <span className="block text-2xl font-bold text-emerald-400">{avgScore}%</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">ATS Formatting Pass</span>
                <span className="block text-2xl font-bold text-violet-300">92%</span>
              </div>
            </div>
          </div>

          {/* Recent Job Analysis History */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Recent Resume-Job Matches
              </h3>
              <Link to="/analyzer" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                + Run New Match
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading history...</div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.jobTitle}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.jobDescription.substring(0, 90)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-extrabold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {item.matchScore}% Match
                      </span>
                      <Link
                        to={`/analyzer`}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        View Analysis <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Sample Demo History items if DB empty */
              <div className="space-y-3">
                {[
                  { title: 'Senior Full-Stack Engineer (React/Node)', score: 86, company: 'TechCorp Solutions' },
                  { title: 'Lead AI Application Engineer (FastAPI/Python)', score: 92, company: 'InnovateAI Labs' },
                ].map((demo, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{demo.title}</h4>
                      <span className="text-xs text-slate-400">{demo.company}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-extrabold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {demo.score}% Match
                      </span>
                      <Link
                        to="/analyzer"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1"
                      >
                        View Analysis <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
