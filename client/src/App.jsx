import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { AIMatcherPage } from './pages/AIMatcherPage';
import { TrackerPage } from './pages/TrackerPage';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center text-center px-6">
          <div className="space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
            <p className="text-slate-400 text-sm">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
    <div className="space-y-4">
      <p className="text-8xl font-extrabold text-brand-600">404</p>
      <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
      <p className="text-slate-400 text-sm">The page you're looking for doesn't exist.</p>
      <a href="/" className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold hover:bg-brand-500">
        Back to Home
      </a>
    </div>
  </div>
);

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
    <ErrorBoundary>
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
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastNotification />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
