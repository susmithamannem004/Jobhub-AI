import API from './client';

export const aiApi = {
  matchResume: (payload) => API.post('/ai/match', payload),
  matchResumePdf: (formData, config = {}) => API.post('/ai/match-pdf', formData, config),
  generateCoverLetter: (payload) => API.post('/ai/cover-letter', payload)
};
