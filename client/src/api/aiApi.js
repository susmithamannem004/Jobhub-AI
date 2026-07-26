import API from './client';

export const aiApi = {
  matchResume: (payload) => API.post('/ai/match', payload),
  generateCoverLetter: (payload) => API.post('/ai/cover-letter', payload)
};
