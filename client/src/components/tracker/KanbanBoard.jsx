import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationCard } from './ApplicationCard';
import { Plus, Kanban } from 'lucide-react';

export const KanbanBoard = () => {
  const { applications, loadingApps, addApplication } = useApp();

  const columns = [
    { title: 'Saved Jobs', status: 'Saved', color: 'border-slate-700 text-slate-300' },
    { title: 'Applied', status: 'Applied', color: 'border-brand-500/40 text-brand-400' },
    { title: 'Interviewing', status: 'Interviewing', color: 'border-accent-500/40 text-accent-400' },
    { title: 'Offer Received', status: 'Offer', color: 'border-emerald-500/40 text-emerald-400' },
    { title: 'Rejected', status: 'Rejected', color: 'border-rose-500/40 text-rose-400' },
  ];

  const handleQuickAdd = async (status) => {
    const jobTitle = prompt('Enter Job Title:');
    if (!jobTitle) return;
    const company = prompt('Enter Company Name:') || 'Company';
    await addApplication({
      jobTitle,
      company,
      status
    });
  };

  if (loadingApps) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="animate-pulse font-medium">Loading application pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Board Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {columns.map(col => {
          const count = applications.filter(a => a.status === col.status).length;
          return (
            <div key={col.status} className="glass-card rounded-xl p-3 border border-slate-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{col.title}</span>
              <span className={`text-2xl font-extrabold ${col.color.split(' ')[1]}`}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {columns.map(col => {
          const colApps = applications.filter(a => a.status === col.status);
          return (
            <div key={col.status} className="glass-card rounded-2xl p-4 border border-slate-800 min-w-[240px] flex flex-col space-y-4">
              
              {/* Column Title Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <h3 className={`text-xs font-extrabold uppercase tracking-wider ${col.color.split(' ')[1]}`}>
                    {col.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                    {colApps.length}
                  </span>
                </div>

                <button
                  onClick={() => handleQuickAdd(col.status)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={`Add job to ${col.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {colApps.map(app => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
                {colApps.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-600 text-xs">
                    <span>No applications</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
