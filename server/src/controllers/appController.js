import { readJson, writeJson } from '../db/jsonStore.js';
import { config } from '../config/index.js';

const APPS_FILE = 'applications.json';
const JOBS_FILE = 'jobs.json';
const isProd = config.env === 'production';
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function getApplications(req, res) {
  try {
    const { status } = req.query;
    let apps = await readJson(APPS_FILE);
    if (status && status !== 'All') {
      apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }
    res.json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    console.error('[getApplications]', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to retrieve applications' : error.message });
  }
}

export async function createApplication(req, res) {
  try {
    const { jobId, jobTitle, company, status, notes } = req.body;
    if (!jobId && !jobTitle) {
      return res.status(400).json({ success: false, message: 'Job ID or Job Title is required' });
    }

    let finalTitle = jobTitle || 'Position';
    let finalCompany = company || 'Company';

    if (!IS_VERCEL) {
      const apps = await readJson(APPS_FILE);
      const existing = apps.find(a => a.jobId === jobId);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Job is already in your tracker pipeline' });
      }
      if (jobId && (!jobTitle || !company)) {
        const jobs = await readJson(JOBS_FILE);
        const found = jobs.find(j => j.id === jobId);
        if (found) { finalTitle = found.title; finalCompany = found.company; }
      }
    } else {
      console.log('[appController] Demo mode — application created in-memory only, not persisted');
      if (jobId && (!jobTitle || !company)) {
        const jobs = await readJson(JOBS_FILE);
        const found = jobs.find(j => j.id === jobId);
        if (found) { finalTitle = found.title; finalCompany = found.company; }
      }
    }

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: jobId || `custom-${Date.now()}`,
      jobTitle: finalTitle,
      company: finalCompany,
      status: status || 'Saved',
      notes: notes || '',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!IS_VERCEL) {
      const apps = await readJson(APPS_FILE);
      apps.unshift(newApp);
      await writeJson(APPS_FILE, apps);
    }

    res.status(201).json({ success: true, data: newApp, demo: IS_VERCEL || undefined });
  } catch (error) {
    console.error('[createApplication]', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to track application' : error.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (IS_VERCEL) {
      console.log('[appController] Demo mode — update not persisted');
      const mockUpdated = {
        id,
        status: status || 'Applied',
        notes: notes || '',
        updatedAt: new Date().toISOString()
      };
      return res.json({ success: true, data: mockUpdated, demo: true });
    }

    const apps = await readJson(APPS_FILE);
    const index = apps.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Application record not found' });
    if (status) apps[index].status = status;
    if (notes !== undefined) apps[index].notes = notes;
    apps[index].updatedAt = new Date().toISOString();
    await writeJson(APPS_FILE, apps);
    res.json({ success: true, data: apps[index] });
  } catch (error) {
    console.error('[updateApplication]', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to update application' : error.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;

    if (IS_VERCEL) {
      console.log('[appController] Demo mode — delete not persisted');
      return res.json({ success: true, message: 'Application removed from tracker', demo: true });
    }

    let apps = await readJson(APPS_FILE);
    const filtered = apps.filter(a => a.id !== id);
    if (apps.length === filtered.length) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }
    await writeJson(APPS_FILE, filtered);
    res.json({ success: true, message: 'Application removed from tracker' });
  } catch (error) {
    console.error('[deleteApplication]', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to delete application' : error.message });
  }
}
