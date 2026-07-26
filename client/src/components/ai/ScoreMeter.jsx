import React from 'react';

export const ScoreMeter = ({ score = 0, engine = '' }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-amber-500';
  let strokeColor = '#f59e0b';
  let badgeVariant = 'Moderate Fit';

  if (score >= 80) {
    colorClass = 'text-emerald-400';
    strokeColor = '#34d399';
    badgeVariant = 'Excellent Match';
  } else if (score >= 65) {
    colorClass = 'text-brand-400';
    strokeColor = '#60a5fa';
    badgeVariant = 'Good Match';
  } else if (score < 50) {
    colorClass = 'text-rose-400';
    strokeColor = '#f43f5e';
    badgeVariant = 'Low Match';
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1f2937"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colorClass}`}>
            {score}%
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fit Score</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colorClass} bg-slate-900 border border-slate-800`}>
          {badgeVariant}
        </span>
        {engine && (
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Engine: {engine}
          </p>
        )}
      </div>
    </div>
  );
};
