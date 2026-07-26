import React from 'react';
import { MapPin, Briefcase, DollarSign, Sparkles, ArrowRight, Bookmark } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const JobCard = ({ job, onSelect, onMatchAI }) => {
  const { applications, addApplication } = useApp();

  const isTracked = applications.some(a => a.jobId === job.id);

  const handleTrack = async (e) => {
    e.stopPropagation();
    if (isTracked) return;
    await addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: 'Saved'
    });
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between space-y-4 group relative text-left"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <img 
            src={job.logo} 
            alt={job.company}
            className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-900 group-hover:scale-105 transition-transform" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-slate-400 font-medium">{job.company}</p>
          </div>
        </div>

        <button
          onClick={handleTrack}
          title={isTracked ? 'Saved to Tracker' : 'Save Job'}
          className={`p-2 rounded-xl border transition-colors ${
            isTracked
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isTracked ? 'fill-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Description Snippet */}
      <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.location}</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.type}</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{job.salary}</span>
        </span>
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {job.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="brand">{tag}</Badge>
        ))}
        {job.tags.length > 4 && (
          <Badge variant="default">+{job.tags.length - 4}</Badge>
        )}
      </div>

      {/* Bottom Footer Action */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMatchAI(job);
          }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 border border-accent-500/30 flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant AI Fit</span>
        </button>

        <span className="text-xs font-semibold text-brand-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
