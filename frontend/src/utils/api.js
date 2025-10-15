import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const auth = {
  // Student registration
  registerStudent: (userData) => api.post('/auth/register', userData),
  
  // Mentor registration
  registerMentor: (userData) => api.post('/auth/register', userData),
  
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update profile
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Student endpoints
export const students = {
  // Get student dashboard data
  getDashboard: () => api.get('/students/dashboard'),
  
  // Get student profile
  getProfile: () => api.get('/students/profile'),
  
  // Update student profile
  updateProfile: (data) => api.put('/students/profile', data),
  
  // Get assigned mentors
  getMentors: () => api.get('/students/mentors'),
  
  // Get study materials
  getStudyMaterials: () => api.get('/students/materials'),
  
  // Submit doubt
  submitDoubt: (doubt) => api.post('/students/doubts', doubt),
  
  // Get doubts
  getDoubts: () => api.get('/students/doubts'),
  
  // Submit feedback
  submitFeedback: (feedback) => api.post('/students/feedback', feedback),
  
  // Get meetings
  getMeetings: () => api.get('/students/meetings'),
  
  // Schedule meeting
  scheduleMeeting: (meetingData) => api.post('/students/meetings', meetingData)
};

// Mentor endpoints
export const mentors = {
  // Get all approved mentors (public)
  getApproved: () => api.get('/mentors/approved'),
  
  // Get mentor dashboard data
  getDashboard: () => api.get('/mentors/dashboard'),
  
  // Get mentor profile
  getProfile: () => api.get('/mentors/profile'),
  
  // Update mentor profile
  updateProfile: (data) => api.put('/mentors/profile', data),
  
  // Get assigned students
  getStudents: () => api.get('/mentors/students'),
  
  // Upload study material
  uploadMaterial: (materialData) => api.post('/mentors/materials', materialData),
  
  // Get study materials
  getMaterials: () => api.get('/mentors/materials'),
  
  // Get doubts from students
  getDoubts: () => api.get('/mentors/doubts'),
  
  // Answer doubt
  answerDoubt: (doubtId, answer) => api.put(`/mentors/doubts/${doubtId}`, answer),
  
  // Get meetings
  getMeetings: () => api.get('/mentors/meetings'),
  
  // Update meeting
  updateMeeting: (meetingId, data) => api.put(`/mentors/meetings/${meetingId}`, data),
  
  // Get feedback
  getFeedback: () => api.get('/mentors/feedback')
};

// Admin endpoints
export const admin = {
  // Get admin dashboard
  getDashboard: () => api.get('/admins/dashboard'),
  
  // Get pending mentor approvals
  getPendingMentors: () => api.get('/admins/mentors/pending'),
  
  // Approve mentor
  approveMentor: (mentorId) => api.put(`/admins/mentors/${mentorId}/approve`),
  
  // Reject mentor
  rejectMentor: (mentorId, reason) => api.put(`/admins/mentors/${mentorId}/reject`, { reason }),
  
  // Get all users
  getUsers: () => api.get('/admins/users'),
  
  // Get user by ID
  getUser: (userId) => api.get(`/admins/users/${userId}`),
  
  // Update user
  updateUser: (userId, data) => api.put(`/admins/users/${userId}`, data),
  
  // Delete user
  deleteUser: (userId) => api.delete(`/admins/users/${userId}`),
  
  // Get system statistics
  getStats: () => api.get('/admins/stats'),
  
  // Send notification
  sendNotification: (notificationData) => api.post('/admins/notifications', notificationData),
  
  // Get all notifications
  getNotifications: () => api.get('/admins/notifications'),
  
  // Approve study material
  approveMaterial: (materialId) => api.put(`/admins/materials/${materialId}/approve`),
  
  // Get pending materials
  getPendingMaterials: () => api.get('/admins/materials/pending')
};

// Common API methods
export const common = {
  // Get notifications for current user
  getNotifications: () => api.get('/notifications'),
  
  // Mark notification as read
  markNotificationRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  
  // Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Check server health
  healthCheck: () => api.get('/health')
};

// Default export
export default api;