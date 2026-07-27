import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobsApi';
import { useApp } from '../context/AppContext';
import { JobFilter } from '../components/jobs/JobFilter';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { Briefcase, Loader2 } from 'lucide-react';

export const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    q: '',
    location: '',
    type: 'All'
  });

  const { jobRefreshSignal } = useApp();

  const fetchJobs = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await jobsApi.getJobs(filters);
      if (res.success) {
        setJobs(res.data);
      } else {
        setFetchError('The server returned an unexpected response.');
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setFetchError(err.message || 'Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, jobRefreshSignal]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ q: '', location: '', type: 'All' });
  };

  const handleMatchAI = (job) => {
    navigate('/ai-matcher', { state: { selectedJob: job } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
          <Briefcase className="w-7 h-7 text-brand-400" />
          <span>Explore Job Opportunities</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Filter software engineering listings and evaluate your skill compatibility using AI.
        </p>
      </div>

      {/* Filter Component */}
      <JobFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-400" />
          <p className="text-sm font-semibold">Fetching job listings from REST API...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Showing {jobs.length} open positions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onSelect={setSelectedJob}
                onMatchAI={handleMatchAI}
              />
            ))}
          </div>

          {fetchError && (
            <div className="glass-card rounded-2xl p-12 text-center border border-rose-800/50 space-y-3">
              <p className="text-base font-bold text-rose-400">Failed to load job listings</p>
              <p className="text-xs text-slate-400">{fetchError}</p>
              <button
                onClick={fetchJobs}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white"
              >
                Retry
              </button>
            </div>
          )}

          {!fetchError && jobs.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
              <p className="text-base font-bold text-white">No jobs found matching your criteria</p>
              <p className="text-xs text-slate-400">Try adjusting your keyword, location, or employment type filter.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onMatchAI={handleMatchAI}
      />
    </div>
  );
};
