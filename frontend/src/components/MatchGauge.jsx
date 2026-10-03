import React from 'react';

export default function MatchGauge({ score = 75, size = 180, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = '#6366f1';
  let badgeLabel = 'Moderate Match';

  if (score >= 80) {
    scoreColor = '#10b981';
    badgeLabel = 'Strong Fit';
  } else if (score >= 60) {
    scoreColor = '#6366f1';
    badgeLabel = 'Good Fit';
  } else if (score >= 40) {
    scoreColor = '#f59e0b';
    badgeLabel = 'Needs Alignment';
  } else {
    scoreColor = '#ef4444';
    badgeLabel = 'Low Match';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Score Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-white tracking-tight">
          {score}<span className="text-xl text-slate-400 font-medium">%</span>
        </span>
        <span className="text-[11px] font-semibold tracking-wider uppercase mt-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
          {badgeLabel}
        </span>
      </div>
    </div>
  );
}
