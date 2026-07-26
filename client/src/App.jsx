import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { AIMatcherPage } from './pages/AIMatcherPage';
import { TrackerPage } from './pages/TrackerPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Info className="w-4 h-4 text-brand-400" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="glass-card px-4 py-3 rounded-xl border border-slate-800 shadow-2xl flex items-center space-x-3 text-xs font-semibold text-slate-100">
        {icons[toast.type] || icons.success}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/ai-matcher" element={<AIMatcherPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
            </Routes>
          </main>
          <Footer />
          <ToastNotification />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
