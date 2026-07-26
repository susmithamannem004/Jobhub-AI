import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../api/aiApi';
import { FileCheck, Copy, Download, Loader2, Sparkles } from 'lucide-react';

export const CoverLetterGen = ({ selectedJob }) => {
  const { resumeText, showToast } = useApp();
  const [candidateName, setCandidateName] = useState('Alex Morgan');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [engineUsed, setEngineUsed] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const payload = {
        jobId: selectedJob?.id,
        jobTitle: selectedJob?.title || 'Senior Full Stack Engineer',
        company: selectedJob?.company || 'Tech Systems',
        jobDescription: selectedJob?.description || '',
        candidateName,
        resumeText
      };

      const res = await aiApi.generateCoverLetter(payload);
      if (res.success) {
        setCoverLetter(res.data.coverLetter);
        setEngineUsed(res.data.engine);
        showToast('Cover letter generated!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    showToast('Cover letter copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${(selectedJob?.company || 'Company').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-accent-400" />
            <span>AI Cover Letter Generator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tailor a personalized cover letter instantly for {selectedJob ? selectedJob.company : 'your target company'}.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-xs shadow-lg shadow-accent-600/20 flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Letter</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="candidate-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Candidate Full Name</label>
          <input
            id="candidate-name"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="target-position" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Position</label>
          <input
            id="target-position"
            type="text"
            disabled
            value={selectedJob ? `${selectedJob.title} @ ${selectedJob.company}` : 'Senior Full Stack Engineer'}
            className="w-full px-3.5 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Output Letter Textarea */}
      {coverLetter ? (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative">
            <textarea
              rows={10}
              readOnly
              value={coverLetter}
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm leading-relaxed font-sans focus:outline-none"
            />
            {engineUsed && (
              <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                {engineUsed}
              </span>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy to Clipboard</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Text File</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-400 text-sm">
          Click <strong className="text-slate-200">"Generate Letter"</strong> above to produce an AI-crafted cover letter.
        </div>
      )}
    </div>
  );
};
