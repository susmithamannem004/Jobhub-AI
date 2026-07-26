import API from './client';

export const jobsApi = {
  getJobs: (params = {}) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData)
};
