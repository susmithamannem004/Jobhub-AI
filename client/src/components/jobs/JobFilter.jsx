import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

export const JobFilter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8 border border-slate-800 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Keyword Search */}
        <div className="relative md:col-span-2">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by job title, skill (e.g. React, Node.js), or company..."
            value={filters.q}
            onChange={(e) => onFilterChange('q', e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
          />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Location (e.g. Remote, SF)..."
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
          />
        </div>

        {/* Job Type Dropdown */}
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="All">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
          <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Reset button */}
      {(filters.q || filters.location || filters.type !== 'All') && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
