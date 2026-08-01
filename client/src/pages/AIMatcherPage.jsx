import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ResumeMatcher } from '../components/ai/ResumeMatcher';
import { CoverLetterGen } from '../components/ai/CoverLetterGen';
import { Sparkles } from 'lucide-react';

export const AIMatcherPage = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const jobFromLocation = location.state?.selectedJob || null;
    if (jobFromLocation) {
      setSelectedJob(jobFromLocation);
      try {
        sessionStorage.setItem('selectedJob', JSON.stringify(jobFromLocation));
      } catch (e) {
        // ignore storage errors
      }
    } else {
      // Try to restore from sessionStorage when not provided via navigation
      try {
        const stored = sessionStorage.getItem('selectedJob');
        if (stored) setSelectedJob(JSON.parse(stored));
      } catch (e) {
        // ignore parse/storage errors
      }
    }
  }, [location.state]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-xs font-bold text-accent-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Candidate Assistant</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Resume Matcher & Cover Letter AI</h1>
        <p className="text-sm text-slate-400 mt-1">
          Evaluate skill match percentages, identify missing technical keywords, and generate customized cover letters.
        </p>
      </div>

      {/* Main Resume Matcher Tool */}
      <ResumeMatcher selectedJob={selectedJob} />

      {/* Cover Letter Section */}
      <CoverLetterGen selectedJob={selectedJob} />
    </div>
  );
};
