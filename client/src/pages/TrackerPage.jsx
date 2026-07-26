import React from 'react';
import { KanbanBoard } from '../components/tracker/KanbanBoard';
import { Kanban } from 'lucide-react';

export const TrackerPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
          <Kanban className="w-7 h-7 text-emerald-400" />
          <span>Application Pipeline Tracker</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Organize saved roles, track interview progress, and record recruiter notes in your Kanban pipeline.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
};
