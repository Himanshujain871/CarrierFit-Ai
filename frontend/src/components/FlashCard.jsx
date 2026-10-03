import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, HelpCircle, ThumbsUp, ThumbsDown, Award } from 'lucide-react';

export default function FlashCard({ q, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [rated, setRated] = useState(null);

  const categoryColors = {
    Technical: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Behavioral: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    'STAR Method': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Gaps & Weaknesses': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Situational: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const categoryClass = categoryColors[q.category] || categoryColors.Technical;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Q#{index + 1}</span>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${categoryClass}`}>
            {q.category}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
          Difficulty: <span className="text-indigo-400 font-bold">{q.difficulty || 'Medium'}</span>
        </span>
      </div>

      {/* Question Header */}
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-white flex items-start gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          {q.question}
        </h4>
        {q.purpose && (
          <p className="text-xs text-slate-400 italic pl-7">
            Objective: {q.purpose}
          </p>
        )}
      </div>

      {/* Toggle Answer Button */}
      <div className="pt-2">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all border border-slate-800"
        >
          {showAnswer ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
          {showAnswer ? 'Hide Sample Answer & Key Talking Points' : 'Reveal Recommended Answer & Strategy'}
        </button>
      </div>

      {/* Revealed Content */}
      {showAnswer && (
        <div className="space-y-4 pt-2 animate-fadeIn">
          {/* Answer Box */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Strong Sample Answer
            </span>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {q.sampleAnswer || q.sample_answer}
            </p>
          </div>

          {/* Key Points to Mention */}
          {(q.keyPointsToMention || q.key_points_to_mention) && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Bullet Points to Emphasize
              </span>
              <div className="flex flex-wrap gap-2">
                {(q.keyPointsToMention || q.key_points_to_mention).map((pt, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20"
                  >
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    {pt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Self Assessment Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">How confident do you feel with this question?</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRated('confident')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  rated === 'confident'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Confident
              </button>
              <button
                onClick={() => setRated('needs_practice')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                  rated === 'needs_practice'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Needs Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
