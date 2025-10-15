import api from '../utils/api';

export const notificationService = {
  // Send notification about mentor approval status
  async notifyMentorApprovalStatus(notificationData) {
    try {
      const response = await api.post('/admins/notifications', {
        type: 'mentor_approval_status',
        ...notificationData
      });
      return response.data;
    } catch (error) {
      console.error('Error sending mentor approval notification:', error);
      throw error;
    }
  },

  // Send general notification
  async sendNotification(notificationData) {
    try {
      const response = await api.post('/admins/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  // Get all notifications for current user
  async getUserNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Get admin notifications
  async getAdminNotifications() {
    try {
      const response = await api.get('/admins/notifications');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notification count
  async getNotificationCount() {
    try {
      const response = await api.get('/notifications/count');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  },

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  },

  // Send bulk notifications
  async sendBulkNotifications(notifications) {
    try {
      const response = await api.post('/admins/notifications/bulk', { notifications });
      return response.data;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      throw error;
    }
  },

  // Send notification to specific user
  async sendUserNotification(userId, notificationData) {
    try {
      const response = await api.post(`/admins/notifications/user/${userId}`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending user notification:', error);
      throw error;
    }
  },

  // Send notification to specific role
  async sendRoleNotification(role, notificationData) {
    try {
      const response = await api.post(`/admins/notifications/role/${role}`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending role notification:', error);
      throw error;
    }
  },

  // Schedule notification
  async scheduleNotification(notificationData, scheduleDate) {
    try {
      const response = await api.post('/admins/notifications/schedule', {
        ...notificationData,
        scheduleDate
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  // Cancel scheduled notification
  async cancelScheduledNotification(notificationId) {
    try {
      const response = await api.delete(`/admins/notifications/scheduled/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
      throw error;
    }
  },

  // Get notification templates
  async getNotificationTemplates() {
    try {
      const response = await api.get('/admins/notifications/templates');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      throw error;
    }
  },

  // Create notification template
  async createNotificationTemplate(template) {
    try {
      const response = await api.post('/admins/notifications/templates', template);
      return response.data;
    } catch (error) {
      console.error('Error creating notification template:', error);
      throw error;
    }
  },

  // Update notification template
  async updateNotificationTemplate(templateId, template) {
    try {
      const response = await api.put(`/admins/notifications/templates/${templateId}`, template);
      return response.data;
    } catch (error) {
      console.error('Error updating notification template:', error);
      throw error;
    }
  },

  // Delete notification template
  async deleteNotificationTemplate(templateId) {
    try {
      const response = await api.delete(`/admins/notifications/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification template:', error);
      throw error;
    }
  }
};

export default notificationService;