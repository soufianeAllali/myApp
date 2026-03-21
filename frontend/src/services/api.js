import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardService = {
  getOverview: async () => {
    const responses = await Promise.all([
      api.get('/students'),
      api.get('/teachers'),
      api.get('/classes'),
      api.get('/subjects'),
    ]);
    
    const students = responses[0].data;
    const teachers = responses[1].data;
    const classes = responses[2].data;
    const subjects = responses[3].data;

    return {
      studentsCount: students.length,
      teachersCount: teachers.length,
      classesCount: classes.length,
      subjectsCount: subjects.length,
      allStudents: students,
      allClasses: classes,
      allSubjects: subjects,
      recentStudents: students.slice(-10).reverse(),
    };
  },
};

export const teacherService = {
  getAll: () => api.get('/teachers'),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

export const studentService = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const classService = {
  getAll: () => api.get('/classes'),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

export const subjectService = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const scheduleService = {
  getAll: () => api.get('/schedules'),
  generate: () => api.post('/schedules/generate'),
};

export default api;
