import { error as logError } from '../utils/logger.js';

export function validateMatchBody(req, res, next) {
  try {
    const { resumeText } = req.body || {};
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'resumeText is required and must be at least 10 characters.' });
    }
    next();
  } catch (err) {
    logError('validateMatchBody', err);
    return res.status(400).json({ success: false, message: 'Invalid request body.' });
  }
}

export function validateCoverBody(req, res, next) {
  try {
    const { resumeText, candidateName } = req.body || {};
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'resumeText is required and must be at least 20 characters.' });
    }
    if (candidateName && typeof candidateName !== 'string') {
      return res.status(400).json({ success: false, message: 'candidateName must be a string.' });
    }
    next();
  } catch (err) {
    logError('validateCoverBody', err);
    return res.status(400).json({ success: false, message: 'Invalid request body.' });
  }
}
