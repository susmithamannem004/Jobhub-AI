import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { MapPin, Briefcase, DollarSign, Sparkles, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const JobDetailModal = ({ job, isOpen, onClose, onMatchAI }) => {
  const { applications, addApplication } = useApp();

  if (!job) return null;

  const isTracked = applications.some(a => a.jobId === job.id);

  const handleTrack = async () => {
    if (isTracked) return;
    await addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status: 'Saved'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Details & Insights" maxWidth="max-w-3xl">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <img 
            src={job.logo} 
            alt={job.company}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-800 bg-slate-900" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <h2 className="text-xl font-extrabold text-white">{job.title}</h2>
            <p className="text-sm text-brand-400 font-semibold">{job.company}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-2">
              <span className="flex items-center space-x-1"><MapPin className="w-3.5 h-3.5" /> <span>{job.location}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Briefcase className="w-3.5 h-3.5" /> <span>{job.type}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> <span>{job.salary}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onMatchAI(job);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-600 to-brand-600 hover:from-accent-500 hover:to-brand-500 text-white font-bold text-xs shadow-lg shadow-accent-600/20 flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Skill Match</span>
          </button>
          
          <button
            onClick={handleTrack}
            disabled={isTracked}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-2 transition-colors ${
              isTracked
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'border-slate-800 text-slate-300 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isTracked ? 'fill-emerald-400' : ''}`} />
            <span>{isTracked ? 'Saved to Tracker' : 'Save to Tracker'}</span>
          </button>
        </div>
      </div>

      {/* Required Skills Tags */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Skills & Tech Stack</h4>
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag, idx) => (
            <Badge key={idx} variant="brand" className="px-3 py-1 text-xs">{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Role Overview</h4>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Qualifications</h4>
          <ul className="space-y-2">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};
