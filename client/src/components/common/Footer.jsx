import React from 'react';
import { Rocket, Github, Globe, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 py-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Rocket className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-200">JobHub AI</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">© 2026 JobHub AI Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Vercel Deployment</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
