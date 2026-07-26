import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Sparkles, Kanban, PlusCircle, Menu, X, Rocket, Github, Globe } from 'lucide-react';
import { PostJobModal } from '../jobs/PostJobModal';

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  const navLinks = [
    { path: '/jobs', label: 'Explore Jobs', icon: Briefcase },
    { path: '/ai-matcher', label: 'AI Resume Matcher', icon: Sparkles, badge: 'AI' },
    { path: '/tracker', label: 'Application Tracker', icon: Kanban },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-accent-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-300">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                JobHub <span className="gradient-text">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">Career Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all duration-200 ${
                    active
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-accent-500/20 text-accent-400 border border-accent-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://github.com/susmithamannem004/Jobhub-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="View Source on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://jobhub-ai-kohl.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              title="View Live Demo"
            >
              <Globe className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-600/20 hover:shadow-brand-600/35 transition-all duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-3 ${
                    active ? 'bg-brand-500/20 text-brand-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPostJobModalOpen(true);
              }}
              className="w-full mt-2 py-2.5 text-center text-sm font-semibold rounded-lg bg-brand-600 text-white flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>
        )}
      </header>

      {/* Post Job Modal */}
      <PostJobModal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} />
    </>
  );
};
