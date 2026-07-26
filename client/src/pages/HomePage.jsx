import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Kanban, ArrowRight, CheckCircle2, Zap, ShieldCheck, Award } from 'lucide-react';
import { jobsApi } from '../api/jobsApi';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    jobsApi.getJobs().then(res => {
      if (res.success) setFeaturedJobs(res.data.slice(0, 3));
    }).catch(console.error);
  }, []);

  const handleMatchAI = (job) => {
    navigate('/ai-matcher', { state: { selectedJob: job } });
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 rounded-3xl glass-card border border-slate-800/80 px-6 sm:px-12 text-center max-w-6xl mx-auto">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Candidate Career Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Supercharge Your Job Search with <span className="gradient-text">AI Precision</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Instantly match your resume skills against real job requirements, generate tailored cover letters, and track your application pipeline with zero friction.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/jobs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Tech Roles</span>
          </Link>
          <Link
            to="/ai-matcher"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-extrabold text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Try AI Resume Matcher</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Instant AI Fit</h4>
              <p className="text-[11px] text-slate-400">TF-IDF & GPT analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Smart Cover Letters</h4>
              <p className="text-[11px] text-slate-400">1-click customization</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Kanban Tracker</h4>
              <p className="text-[11px] text-slate-400">Manage saved applications</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">JSON DB Engine</h4>
              <p className="text-[11px] text-slate-400">Zero latency REST API</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Featured Tech Roles</h2>
            <p className="text-sm text-slate-400">Hand-picked engineering positions ready for AI resume matching</p>
          </div>

          <Link
            to="/jobs"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center space-x-1"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={setSelectedJob}
              onMatchAI={handleMatchAI}
            />
          ))}
        </div>
      </section>

      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onMatchAI={handleMatchAI}
      />
    </div>
  );
};
