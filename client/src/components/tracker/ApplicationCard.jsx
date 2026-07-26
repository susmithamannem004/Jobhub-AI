import React, { useState } from 'react';
import { Calendar, Trash2, Edit2, Check, X, Building, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApplicationCard = ({ app }) => {
  const { updateAppStatus, removeApplication } = useApp();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(app.notes || '');

  const statusOptions = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const handleSaveNotes = () => {
    updateAppStatus(app.id, app.status, notesText);
    setIsEditingNotes(false);
  };

  const statusColors = {
    Saved: 'text-slate-400 bg-slate-800/80 border-slate-700',
    Applied: 'text-brand-400 bg-brand-500/10 border-brand-500/30',
    Interviewing: 'text-accent-400 bg-accent-500/10 border-accent-500/30',
    Offer: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Rejected: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
            {app.jobTitle}
          </h4>
          <p className="text-xs text-slate-400 font-medium flex items-center space-x-1 mt-0.5">
            <Building className="w-3 h-3 text-slate-500" />
            <span>{app.company}</span>
          </p>
        </div>

        <button
          onClick={() => removeApplication(app.id)}
          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Remove from pipeline"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status Selector */}
      <div className="flex items-center justify-between pt-1">
        <select
          value={app.status}
          onChange={(e) => updateAppStatus(app.id, e.target.value, app.notes)}
          className={`text-xs font-bold px-2.5 py-1 rounded-lg border appearance-none cursor-pointer focus:outline-none ${statusColors[app.status] || statusColors.Saved}`}
        >
          {statusOptions.map(st => (
            <option key={st} value={st} className="bg-slate-900 text-slate-200">
              {st}
            </option>
          ))}
        </select>

        <span className="text-[11px] text-slate-500 flex items-center space-x-1 font-mono">
          <Calendar className="w-3 h-3" />
          <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
        </span>
      </div>

      {/* Notes Section */}
      <div className="pt-2 border-t border-slate-800/80">
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              rows={2}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add interview notes, recruiter contact..."
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingNotes(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
              <button
                onClick={handleSaveNotes}
                className="p-1 rounded bg-brand-600 text-white"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingNotes(true)}
            className="group/notes cursor-pointer flex items-center justify-between text-xs text-slate-400 hover:text-slate-200"
          >
            <p className="line-clamp-2 text-[11px] italic">
              {app.notes || 'Click to add notes...'}
            </p>
            <Edit2 className="w-3 h-3 text-slate-600 group-hover/notes:text-brand-400 opacity-0 group-hover/notes:opacity-100 transition-opacity ml-1 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};
