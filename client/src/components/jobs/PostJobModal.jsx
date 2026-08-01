import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { jobsApi } from '../../api/jobsApi';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Loader2 } from 'lucide-react';

export const PostJobModal = ({ isOpen, onClose }) => {
  const { showToast, notifyJobPosted } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120,000 - $150,000 / year',
    tags: 'React, Node.js, Express, Tailwind CSS',
    description: '',
    requirements: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      showToast('Please fill out Title, Company, and Description', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map(r => r.trim()).filter(Boolean)
      };

      const res = await jobsApi.createJob(payload);
      if (res.success) {
        showToast('Job listing posted successfully!', 'success');
        notifyJobPosted();
        onClose();
        setFormData({
          title: '',
          company: '',
          location: 'Remote',
          type: 'Full-time',
          salary: '$120,000 - $150,000 / year',
          tags: 'React, Node.js, Express, Tailwind CSS',
          description: '',
          requirements: ''
        });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Job Opportunity" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="job-title" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Title *</label>
            <input
              id="job-title"
              type="text"
              required
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="company-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Company Name *</label>
            <input
              id="company-name"
              type="text"
              required
              placeholder="e.g. TechCorp Innovations"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="job-location" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Location</label>
            <input
              id="job-location"
              type="text"
              placeholder="Remote / San Francisco"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="employment-type" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Employment Type</label>
            <select
              id="employment-type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-brand-500 focus:outline-none cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary-range" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Salary Range</label>
            <input
              id="salary-range"
              type="text"
              placeholder="$120,000 - $150,000"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tech-tags" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Tech Stack Tags (Comma separated)</label>
          <input
            id="tech-tags"
            type="text"
            placeholder="React, Node.js, Express, Tailwind CSS, TypeScript"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="job-description" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Job Description *</label>
          <textarea
            id="job-description"
            rows={3}
            required
            placeholder="Describe the job position, team environment, and core duties..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="job-requirements" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Requirements (One per line)</label>
          <textarea
            id="job-requirements"
            rows={3}
            placeholder="3+ years React & Node.js experience&#10;Strong understanding of REST APIs&#10;Experience with Tailwind CSS"
            value={formData.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Job</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
