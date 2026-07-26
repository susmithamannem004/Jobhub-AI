import { readJson, writeJson } from '../db/jsonStore.js';

const APPS_FILE = 'applications.json';
const JOBS_FILE = 'jobs.json';

/**
 * GET /api/applications - List tracked applications
 */
export async function getApplications(req, res) {
  try {
    const { status } = req.query;
    let apps = await readJson(APPS_FILE);

    if (status && status !== 'All') {
      apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    res.json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve applications', error: error.message });
  }
}

/**
 * POST /api/applications - Save/Track job application
 */
export async function createApplication(req, res) {
  try {
    const { jobId, jobTitle, company, status, notes } = req.body;

    if (!jobId && !jobTitle) {
      return res.status(400).json({ success: false, message: 'Job ID or Job Title is required' });
    }

    const apps = await readJson(APPS_FILE);
    
    // Check if already tracked
    const existing = apps.find(a => a.jobId === jobId);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Job is already in your tracker pipeline' });
    }

    let finalTitle = jobTitle || 'Position';
    let finalCompany = company || 'Company';

    if (jobId && (!jobTitle || !company)) {
      const jobs = await readJson(JOBS_FILE);
      const found = jobs.find(j => j.id === jobId);
      if (found) {
        finalTitle = found.title;
        finalCompany = found.company;
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

    apps.unshift(newApp);
    await writeJson(APPS_FILE, apps);

    res.status(201).json({ success: true, data: newApp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track application', error: error.message });
  }
}

/**
 * PUT /api/applications/:id - Update status or notes
 */
export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const apps = await readJson(APPS_FILE);
    const index = apps.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    if (status) apps[index].status = status;
    if (notes !== undefined) apps[index].notes = notes;
    apps[index].updatedAt = new Date().toISOString();

    await writeJson(APPS_FILE, apps);

    res.json({ success: true, data: apps[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update application', error: error.message });
  }
}

/**
 * DELETE /api/applications/:id - Remove application from pipeline
 */
export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    let apps = await readJson(APPS_FILE);
    const filtered = apps.filter(a => a.id !== id);

    if (apps.length === filtered.length) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    await writeJson(APPS_FILE, filtered);

    res.json({ success: true, message: 'Application removed from tracker' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete application', error: error.message });
  }
}
