import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StarCard from '../components/StarCard';
import { Wand2, Sparkles, Copy, Check, FileCode, ArrowRight } from 'lucide-react';

export default function ResumeImprover() {
  const [copiedAll, setCopiedAll] = useState(false);

  const sampleImprovements = [
    {
      original: 'Responsible for building frontend features in React.',
      improved: 'Architected modular React component library with custom hooks, reducing UI bundle size by 24% and accelerating feature delivery speed by 2 weeks per sprint.',
      star_breakdown: {
        situation: 'Large bloated UI bundle slowed down page load speeds.',
        task: 'Refactor frontend code into modular reusable components.',
        action: 'Extracted state management hooks and lazy-loaded heavy page routes.',
        result: 'Achieved 24% smaller bundle size and faster initial load.'
      },
      key_addition: 'Added quantifiable bundle size reduction (24%) and sprint velocity metric.'
    },
    {
      original: 'Worked with database and created backend endpoints.',
      improved: 'Engineered high-concurrency Express.js REST APIs with MongoDB indexing and Redis caching, serving 50,000+ active users with sub-100ms response times.',
      star_breakdown: {
        situation: 'Backend database queries experienced locks during peak traffic.',
        task: 'Optimize API layer and caching strategy.',
        action: 'Implemented Redis memory cache and database index optimization.',
        result: 'Supported 50k+ active users at sub-100ms response times.'
      },
      key_addition: 'Included scale indicators (50k+ active users) and latency metrics.'
    },
    {
      original: 'Helped team fix bugs and write tests.',
      improved: 'Spearheaded automated unit testing initiative using Jest, raising codebase test coverage from 45% to 92% and cutting production regression defects by 35%.',
      star_breakdown: {
        situation: 'Frequent regression bugs slowed down release cycles.',
        task: 'Establish comprehensive automated testing coverage.',
        action: 'Built Jest mock suites and integrated PR test checks in GitHub Actions.',
        result: 'Boosted coverage to 92% and reduced production defects.'
      },
      key_addition: 'Quantified test coverage jump (45% -> 92%) and bug reduction.'
    }
  ];

  const actionVerbs = [
    'Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Orchestrated',
    'Accelerated', 'Overhauled', 'Streamlined', 'Pioneered', 'Implemented'
  ];

  const handleCopyAll = () => {
    const text = sampleImprovements.map((s) => `• ${s.improved}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
                <Wand2 className="w-7 h-7 text-cyan-400" />
                STAR Resume Bullet Rewriter
              </h1>
              <p className="text-slate-400 text-sm">
                Transform passive descriptions into high-impact, metrics-driven STAR statements tailored to your target job.
              </p>
            </div>

            <button
              onClick={handleCopyAll}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all shrink-0"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedAll ? 'All Bullets Copied!' : 'Copy All Improved Bullets'}
            </button>
          </div>

          {/* Power Action Verbs Toolbar */}
          <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> High-Impact Action Verbs Bank
            </span>
            <div className="flex flex-wrap gap-2">
              {actionVerbs.map((verb, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/20 transition-all cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(verb)}
                  title="Click to copy verb"
                >
                  + {verb}
                </span>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {sampleImprovements.map((item, idx) => (
              <StarCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
