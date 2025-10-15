import api from '../utils/api';

export const mentorService = {
  // Get all pending mentors for admin approval
  async getPendingMentors() {
    try {
      const response = await api.get('/admins/mentors/pending');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
      throw error;
    }
  },

  // Get all approved mentors
  async getApprovedMentors() {
    try {
      const response = await api.get('/mentors/approved');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching approved mentors:', error);
      throw error;
    }
  },

  // Get all mentors (for admin)
  async getAllMentors() {
    try {
      const response = await api.get('/admins/mentors');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching all mentors:', error);
      throw error;
    }
  },

  // Approve a mentor
  async approveMentor(mentorId) {
    try {
      const response = await api.put(`/admins/mentors/${mentorId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving mentor:', error);
      throw error;
    }
  },

  // Reject a mentor
  async rejectMentor(mentorId, reason) {
    try {
      const response = await api.put(`/admins/mentors/${mentorId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      throw error;
    }
  },

  // Get mentor profile
  async getMentorProfile(mentorId) {
    try {
      const response = await api.get(`/mentors/${mentorId}/profile`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
      throw error;
    }
  },

  // Update mentor profile
  async updateMentorProfile(mentorId, profileData) {
    try {
      const response = await api.put(`/mentors/${mentorId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating mentor profile:', error);
      throw error;
    }
  },

  // Get mentor dashboard data
  async getMentorDashboard() {
    try {
      const response = await api.get('/mentors/dashboard');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mentor dashboard:', error);
      throw error;
    }
  },

  // Get mentor's assigned students
  async getMentorStudents(mentorId) {
    try {
      const response = await api.get(`/mentors/${mentorId}/students`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching mentor students:', error);
      throw error;
    }
  },

  // Get mentor statistics
  async getMentorStats(mentorId) {
    try {
      const response = await api.get(`/mentors/${mentorId}/stats`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
      throw error;
    }
  },

  // Upload mentor documents
  async uploadMentorDocuments(mentorId, documents) {
    try {
      const formData = new FormData();
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formData.append(key, documents[key]);
        }
      });

      const response = await api.post(`/mentors/${mentorId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading mentor documents:', error);
      throw error;
    }
  },

  // Search mentors
  async searchMentors(searchParams) {
    try {
      const response = await api.get('/mentors/search', { params: searchParams });
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error searching mentors:', error);
      throw error;
    }
  },

  // Get mentor reviews/feedback
  async getMentorReviews(mentorId) {
    try {
      const response = await api.get(`/mentors/${mentorId}/reviews`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching mentor reviews:', error);
      throw error;
    }
  },

  // Get mentor availability
  async getMentorAvailability(mentorId) {
    try {
      const response = await api.get(`/mentors/${mentorId}/availability`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching mentor availability:', error);
      throw error;
    }
  },

  // Update mentor availability
  async updateMentorAvailability(mentorId, availability) {
    try {
      const response = await api.put(`/mentors/${mentorId}/availability`, availability);
      return response.data;
    } catch (error) {
      console.error('Error updating mentor availability:', error);
      throw error;
    }
  }
};

export default mentorService;