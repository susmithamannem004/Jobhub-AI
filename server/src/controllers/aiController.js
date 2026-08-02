import { readJson } from '../db/jsonStore.js';
import { analyzeResumeFit, generateCoverLetter, parseResumePdf } from '../services/aiService.js';
import { config } from '../config/index.js';
import { info, warn, error as logError } from '../utils/logger.js';

const JOBS_FILE = 'jobs.json';
const isProd = config.env === 'production';

/**
 * POST /api/ai/match
 */
export async function matchResume(req, res) {
  try {
    const { jobId, jobTitle, jobDescription, requirements, resumeText } = req.body || {};
    info('matchResume called', { jobId, jobTitle });

    let targetJob = {
      jobTitle: jobTitle || 'Software Engineer',
      jobDescription: jobDescription || '',
      requirements: Array.isArray(requirements) ? requirements : []
    };

    if (jobId) {
      const jobs = await readJson(JOBS_FILE).catch(err => {
        logError('Failed reading jobs.json', err);
        return [];
      });
      const found = Array.isArray(jobs) ? jobs.find(j => j.id === jobId) : undefined;
      if (found) {
        targetJob = {
          jobTitle: found.title || targetJob.jobTitle,
          jobDescription: found.description || targetJob.jobDescription,
          requirements: found.requirements || targetJob.requirements
        };
      }
    }

    const result = await analyzeResumeFit({ ...targetJob, resumeText });
    res.json({ success: true, data: result });
  } catch (err) {
    logError('[matchResume] error', err);
    const message = isProd ? 'AI match analysis failed' : (err.message || 'Unknown error');
    // avoid leaking internals
    res.status(500).json({ success: false, message });
  }
}

/**
 * POST /api/ai/match-pdf
 */
export async function matchResumePdf(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'A PDF resume file is required.' });
    }

    const resumeText = await parseResumePdf(req.file.buffer);
    if (!resumeText || resumeText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Failed to extract resume text from the PDF.' });
    }

    const targetJob = await resolveTargetJob(req.body).catch(err => {
      logError('resolveTargetJob failed', err);
      return { jobTitle: 'Software Engineer', jobDescription: '', requirements: [] };
    });

    const result = await analyzeResumeFit({ ...targetJob, resumeText });
    const minimalResult = {
      matchScore: result?.matchScore || 0,
      matchingSkills: result?.matchingSkills || [],
      missingSkills: result?.missingSkills || [],
      improvementSuggestions: (result?.tips || []).slice(0, 3)
    };

    res.json({ success: true, data: minimalResult });
  } catch (err) {
    logError('[matchResumePdf] error', err);
    let message = err.message || 'Resume processing failed';
    if (!message.includes('PDF')) {
      message = isProd ? 'Resume processing failed' : message;
    }
    res.status(500).json({ success: false, message });
  }
}

async function resolveTargetJob(body) {
  const { jobId, jobTitle, jobDescription, requirements } = body;
  const parsedRequirements = normalizeRequirements(requirements);

  if (!jobId) {
    return {
      jobTitle: jobTitle || 'Software Engineer',
      jobDescription: jobDescription || '',
      requirements: parsedRequirements
    };
  }

  const jobs = await readJson(JOBS_FILE);
  const found = jobs.find(j => j.id === jobId);
  if (found) {
    return {
      jobTitle: found.title,
      jobDescription: found.description,
      requirements: found.requirements || []
    };
  }

  return {
    jobTitle: jobTitle || 'Software Engineer',
    jobDescription: jobDescription || '',
    requirements: parsedRequirements
  };
}

function normalizeRequirements(requirements) {
  if (Array.isArray(requirements)) {
    return requirements;
  }

  if (typeof requirements !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(requirements);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * POST /api/ai/cover-letter
 */
export async function generateCover(req, res) {
  try {
    const { jobId, company, jobTitle, jobDescription, candidateName, resumeText } = req.body || {};
    info('generateCover called', { jobId, company, candidateName });

    let target = {
      jobTitle: jobTitle || 'Software Engineer',
      company: company || 'Company',
      jobDescription: jobDescription || '',
    };

    if (jobId) {
      const jobs = await readJson(JOBS_FILE).catch(err => {
        logError('Failed reading jobs.json', err);
        return [];
      });
      const found = Array.isArray(jobs) ? jobs.find(j => j.id === jobId) : undefined;
      if (found) {
        target = { jobTitle: found.title || target.jobTitle, company: found.company || target.company, jobDescription: found.description || target.jobDescription };
      }
    }

    const result = await generateCoverLetter({ ...target, candidateName, resumeText });
    res.json({ success: true, data: result });
  } catch (err) {
    logError('[generateCover] error', err);
    const message = isProd ? 'Cover letter generation failed' : (err.message || 'Unknown error');
    res.status(500).json({ success: false, message });
  }
}
