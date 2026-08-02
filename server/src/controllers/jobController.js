import { readJson, writeJson } from '../db/jsonStore.js';
import { config } from '../config/index.js';
import { info, warn, error as logError } from '../utils/logger.js';

const JOBS_FILE = 'jobs.json';
const isProd = config.env === 'production';
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

export async function getJobs(req, res) {
  try {
    const { q, location, type, experience } = req.query;
    let jobs = await readJson(JOBS_FILE);

    if (q) {
      const term = q.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title && j.title.toLowerCase().includes(term)) ||
        (j.company && j.company.toLowerCase().includes(term)) ||
        (Array.isArray(j.tags) && j.tags.some(t => String(t).toLowerCase().includes(term))) ||
        (j.description && j.description.toLowerCase().includes(term))
      );
    }
    if (location) {
      const locTerm = location.toLowerCase();
      jobs = jobs.filter(j => j.location.toLowerCase().includes(locTerm));
    }
    if (type && type !== 'All') {
      jobs = jobs.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }
    if (experience && experience !== 'All') {
      jobs = jobs.filter(j => j.experience.toLowerCase().includes(experience.toLowerCase()));
    }

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    logError('[getJobs] error', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to retrieve job listings' : error.message });
  }
}

export async function getJobById(req, res) {
  try {
    const { id } = req.params;
    const jobs = await readJson(JOBS_FILE);
    const job = Array.isArray(jobs) ? jobs.find(j => j.id === id) : undefined;
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    logError('[getJobById] error', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to fetch job details' : error.message });
  }
}

export async function createJob(req, res) {
  try {
    const { title, company, location, type, experience, salary, description, requirements, tags, logo } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ success: false, message: 'Title, company, and description are required fields' });
    }

    const newJob = {
      id: `job-${Date.now()}`,
      title,
      company,
      logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      location: location || 'Remote',
      type: type || 'Full-time',
      experience: experience || 'Mid Level',
      salary: salary || '$110,000 - $140,000 / year',
      postedAt: new Date().toISOString(),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['React', 'Node.js']),
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : (typeof requirements === 'string' ? requirements.split('\n').filter(Boolean) : [description])
    };

    if (!IS_VERCEL) {
      const jobs = await readJson(JOBS_FILE);
      jobs.unshift(newJob);
      await writeJson(JOBS_FILE, jobs);
    } else {
      info('[jobController] Demo mode — job created in-memory only, not persisted');
    }

    res.status(201).json({ success: true, data: newJob, demo: IS_VERCEL || undefined });
  } catch (error) {
    logError('[createJob] error', error);
    res.status(500).json({ success: false, message: isProd ? 'Failed to create job listing' : error.message });
  }
}
