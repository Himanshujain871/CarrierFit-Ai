import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Sparkles, CheckCircle } from 'lucide-react';

export default function StarCard({ item, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          STAR Enhancement #{index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all border border-slate-700"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Bullet!' : 'Copy Improved'}
        </button>
      </div>

      {/* Comparison Diffs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Bullet */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-rose-500/20 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
            Original (Weak / Passive)
          </span>
          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            {item.original}
          </p>
        </div>

        {/* Improved STAR Bullet */}
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 p-4 rounded-xl border border-indigo-500/30 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Improved STAR Bullet (High Impact)
          </span>
          <p className="text-sm text-white leading-relaxed font-semibold">
            {item.improved}
          </p>
        </div>
      </div>

      {/* STAR Breakdown Accordion */}
      {item.star_breakdown && (
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-bold text-indigo-400">Situation: </span>
            <span className="text-slate-400">{item.star_breakdown.situation}</span>
          </div>
          <div>
            <span className="font-bold text-violet-400">Task: </span>
            <span className="text-slate-400">{item.star_breakdown.task}</span>
          </div>
          <div>
            <span className="font-bold text-cyan-400">Action: </span>
            <span className="text-slate-400">{item.star_breakdown.action}</span>
          </div>
          <div>
            <span className="font-bold text-emerald-400">Result: </span>
            <span className="text-slate-400">{item.star_breakdown.result}</span>
          </div>
        </div>
      )}

      {/* Key Addition Tag */}
      {item.key_addition && (
        <p className="text-xs text-indigo-300/80 italic flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          {item.key_addition}
        </p>
      )}
    </div>
  );
}
