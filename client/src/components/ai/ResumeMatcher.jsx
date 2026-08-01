import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../api/aiApi';
import { ScoreMeter } from './ScoreMeter';
import { Badge } from '../common/Badge';
import { Sparkles, CheckCircle2, AlertCircle, Lightbulb, Loader2, FileText } from 'lucide-react';

export const ResumeMatcher = ({ selectedJob }) => {
  const { resumeText, setResumeText, showToast } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const [customJobTitle, setCustomJobTitle] = useState(selectedJob ? selectedJob.title : '');
  const [customJobDesc, setCustomJobDesc] = useState(selectedJob ? selectedJob.description : '');

  useEffect(() => {
    if (selectedJob) {
      setCustomJobTitle(selectedJob.title || '');
      setCustomJobDesc(selectedJob.description || '');
    } else {
      // clear custom fields when no selected job
      setCustomJobTitle('');
      setCustomJobDesc('');
    }
  }, [selectedJob]);

  const handleRunMatch = async () => {
    if (!resumeText || resumeText.trim().length < 10) {
      showToast('Please enter your resume text (at least 10 characters).', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const payload = {
        jobId: selectedJob?.id,
        jobTitle: selectedJob ? selectedJob.title : customJobTitle,
        jobDescription: selectedJob ? selectedJob.description : customJobDesc,
        requirements: selectedJob?.requirements || [],
        resumeText
      };

      const res = await aiApi.matchResume(payload);
      if (res.success) {
        setMatchResult(res.data);
        showToast('AI Skill Analysis completed!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Job Info Card */}
      {selectedJob ? (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={selectedJob.logo} 
              alt={selectedJob.company} 
              className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-900"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Analyzing Target Job</span>
              <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
              <p className="text-xs text-slate-400">{selectedJob.company} • {selectedJob.location}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Custom Target Position</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Target Job Title (e.g. Senior React Developer)"
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Key Job Description / Requirements"
              value={customJobDesc}
              onChange={(e) => setCustomJobDesc(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Two Column Layout: Resume Editor & AI Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Resume Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Your Candidate Resume / Skills Summary</span>
            </label>
            <span className="text-xs text-slate-400">{resumeText.length} chars</span>
          </div>

          <textarea
            rows={12}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text, bio, or skills summary here..."
            className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-200 text-sm placeholder-slate-500 focus:border-brand-500 focus:outline-none leading-relaxed font-mono"
          />

          <button
            onClick={handleRunMatch}
            disabled={analyzing}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-accent-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running AI Skill Extraction & Matching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Skill Fit & Match Score</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="lg:col-span-6 space-y-6">
          {matchResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Meter Component */}
              <ScoreMeter score={matchResult.matchScore} engine={matchResult.engine} />

              {/* Summary Card */}
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400">AI Fit Summary</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {matchResult.summary}
                </p>
              </div>

              {/* Matching Skills */}
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matching Skills Identified ({matchResult.matchingSkills?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingSkills?.map((skill, idx) => (
                    <Badge key={idx} variant="success">{skill}</Badge>
                  ))}
                  {(!matchResult.matchingSkills || matchResult.matchingSkills.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No direct taxonomy skills found matching resume.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Skills Recommended to Add ({matchResult.missingSkills?.length || 0})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingSkills?.map((skill, idx) => (
                    <Badge key={idx} variant="danger">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              {matchResult.tips && matchResult.tips.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>AI Optimization Tips</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {matchResult.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Sparkles className="w-8 h-8 text-brand-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Ready for AI Analysis</h4>
              <p className="text-sm text-slate-400 max-w-md">
                Paste your resume on the left and click <strong className="text-slate-200">"Analyze Skill Fit"</strong> to get instant candidate fit scoring and recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
