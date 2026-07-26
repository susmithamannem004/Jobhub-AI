import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { appsApi } from '../api/appsApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [jobRefreshSignal, setJobRefreshSignal] = useState(0);
  const [resumeText, setResumeText] = useState(() => {
    return localStorage.getItem('jobhub_user_resume') || 
`Senior Full Stack Engineer with 4+ years of hands-on experience building web applications using React, Node.js, Express, TypeScript, and Tailwind CSS. Proficient in REST API design, state management, Vite, Axios, CI/CD pipelines (GitHub Actions, Vercel), and automated testing. Dedicated to clean code architecture and crafting responsive user interfaces.`;
  });
  
  const [toast, setToast] = useState(null);

  // Sync resumeText to localStorage
  useEffect(() => {
    localStorage.setItem('jobhub_user_resume', resumeText);
  }, [resumeText]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await appsApi.getApplications();
      if (res.success) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  const notifyJobPosted = useCallback(() => {
    setJobRefreshSignal((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const addApplication = useCallback(async (appData) => {
    try {
      const res = await appsApi.createApplication(appData);
      if (res.success) {
        setApplications((prev) => [res.data, ...prev]);
        showToast(`Saved ${res.data.jobTitle} to Tracker!`, 'success');
        return res.data;
      }
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  }, [showToast]);

  const updateAppStatus = useCallback(async (id, status, notes) => {
    try {
      const res = await appsApi.updateApplication(id, { status, notes });
      if (res.success) {
        setApplications((prev) => prev.map((a) => (a.id === id ? res.data : a)));
        showToast('Application updated', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [showToast]);

  const removeApplication = useCallback(async (id) => {
    try {
      const res = await appsApi.deleteApplication(id);
      if (res.success) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        showToast('Application removed from pipeline', 'info');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, [showToast]);

  const providerValue = useMemo(() => ({
    applications,
    loadingApps,
    fetchApplications,
    addApplication,
    updateAppStatus,
    removeApplication,
    resumeText,
    setResumeText,
    toast,
    showToast,
    jobRefreshSignal,
    notifyJobPosted
  }), [applications, loadingApps, resumeText, toast, jobRefreshSignal, fetchApplications, addApplication, updateAppStatus, removeApplication, showToast, notifyJobPosted]);

  return (
    <AppContext.Provider value={providerValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
