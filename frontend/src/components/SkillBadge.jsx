import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, PlusCircle } from 'lucide-react';

export default function SkillBadge({ name, type = 'matched' }) {
  const styles = {
    matched: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      icon: CheckCircle2,
    },
    critical: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
      icon: AlertCircle,
    },
    recommended: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      icon: AlertTriangle,
    },
    optional: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20',
      icon: PlusCircle,
    },
  };

  const current = styles[type] || styles.matched;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all ${current.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {name}
    </span>
  );
}
