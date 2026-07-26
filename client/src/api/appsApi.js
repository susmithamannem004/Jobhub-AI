import API from './client';

export const appsApi = {
  getApplications: (params = {}) => API.get('/applications', { params }),
  createApplication: (payload) => API.post('/applications', payload),
  updateApplication: (id, payload) => API.put(`/applications/${id}`, payload),
  deleteApplication: (id) => API.delete(`/applications/${id}`)
};
