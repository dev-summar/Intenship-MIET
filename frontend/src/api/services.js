import axiosInstance from './axiosInstance';

export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data), // student: { username, password }
  getMe: () => axiosInstance.get('/auth/me'),
};

export const adminAPI = {
  login: (data) => axiosInstance.post('/admin/login', data), // admin: { email, password }
  getApplications: (params) => axiosInstance.get('/admin/applications', { params }),
  patchApplicationStatus: (id, data) => axiosInstance.patch(`/admin/applications/${id}/status`, data),
};

export const projectsAPI = {
  getOpen: (params) => axiosInstance.get('/projects', { params }),
  getById: (id) => axiosInstance.get(`/projects/${id}`),
  getAll: (params) => axiosInstance.get('/admin/projects', { params }),
  create: (data) => axiosInstance.post('/projects', data),
  update: (id, data) => axiosInstance.put(`/projects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/projects/${id}`),
};

export const applicationsAPI = {
  apply: (data) => axiosInstance.post('/applications', data),
  getMy: () => axiosInstance.get('/applications/my'),
};

export const alumniAPI = {
  getPublic: () => axiosInstance.get('/alumni'),
  getAll: () => axiosInstance.get('/admin/alumni'),
  create: (data) => axiosInstance.post('/admin/alumni', data),
  update: (id, data) => axiosInstance.put(`/admin/alumni/${id}`, data),
  remove: (id) => axiosInstance.delete(`/admin/alumni/${id}`),
};

export const homepageAPI = {
  get: () => axiosInstance.get('/homepage'),
  update: (data) => axiosInstance.put('/admin/homepage', data),
};

export const uploadAPI = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
