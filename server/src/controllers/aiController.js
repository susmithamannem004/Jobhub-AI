import { readJson } from '../db/jsonStore.js';
import { analyzeResumeFit, generateCoverLetter } from '../services/aiService.js';

const JOBS_FILE = 'jobs.json';

/**
 * POST /api/ai/match
 */
export async function matchResume(req, res) {
  try {
    const { jobId, jobTitle, jobDescription, requirements, resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid resume text (at least 10 characters).' });
    }

    let targetJob = {
      jobTitle: jobTitle || 'Software Engineer',
      jobDescription: jobDescription || '',
      requirements: Array.isArray(requirements) ? requirements : []
    };

    if (jobId) {
      const jobs = await readJson(JOBS_FILE);
      const found = jobs.find(j => j.id === jobId);
      if (found) {
        targetJob = {
          jobTitle: found.title,
          jobDescription: found.description,
          requirements: found.requirements || []
        };
      }
    }

    const result = await analyzeResumeFit({
      ...targetJob,
      resumeText
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI match analysis failed', error: error.message });
  }
}

/**
 * POST /api/ai/cover-letter
 */
export async function generateCover(req, res) {
  try {
    const { jobId, company, jobTitle, jobDescription, candidateName, resumeText } = req.body;

    let target = {
      jobTitle: jobTitle || 'Software Engineer',
      company: company || 'Company',
      jobDescription: jobDescription || '',
    };

    if (jobId) {
      const jobs = await readJson(JOBS_FILE);
      const found = jobs.find(j => j.id === jobId);
      if (found) {
        target = {
          jobTitle: found.title,
          company: found.company,
          jobDescription: found.description
        };
      }
    }

    const result = await generateCoverLetter({
      ...target,
      candidateName,
      resumeText
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cover letter generation failed', error: error.message });
  }
}
