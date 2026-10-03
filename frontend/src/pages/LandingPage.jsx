import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, CheckCircle2, ArrowRight, FileText, Target, Award, Brain, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Next-Generation AI Career Strategist & Job Match Engine</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Land Your Dream Tech Job with <span className="gradient-text">Precision AI Matching</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume against any target job description. Get transparent match scores, missing skill identification, STAR-method bullet rewrites, and tailored interview prep cards in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/analyzer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Analyze Resume Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 glass-card hover:text-white hover:border-slate-600 transition-all flex items-center justify-center"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Key Metric Cards Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            {[
              { label: 'ATS Score Boost', val: '+45%', color: 'text-emerald-400' },
              { label: 'Match Precision', val: '99.4%', color: 'text-indigo-400' },
              { label: 'Interview Questions', val: 'Tailored', color: 'text-cyan-400' },
              { label: 'Processing Speed', val: '< 3 Secs', color: 'text-violet-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
                <span className={`block text-2xl md:text-3xl font-extrabold ${stat.color}`}>
                  {stat.val}
                </span>
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">
              End-to-End AI Career Acceleration
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Modular AI microservices working in harmony to maximize your job search callback rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Transparent Job Match</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Breakdown of skill alignment %, experience fit, ATS structural score, and critical missing skill identification.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-violet-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white">2. STAR Bullet Improver</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transform passive bullets into high-impact metrics-driven STAR statements tailored to your target job requirements.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">3. Tailored Interview Prep</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Practice 10+ personalized technical, behavioral, and gap questions with sample answers and talking points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800/80 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 CareerFit AI Platform. Built with React, Express Gateway & FastAPI.</span>
          <div className="flex items-center space-x-4">
            <Link to="/analyzer" className="hover:text-slate-300">Analyzer</Link>
            <Link to="/improver" className="hover:text-slate-300">STAR Rewriter</Link>
            <Link to="/interview/demo" className="hover:text-slate-300">Interview Deck</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
