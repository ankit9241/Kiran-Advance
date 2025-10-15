'use client';

import { useState } from 'react';

interface AnnouncementSystemProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function AnnouncementSystem({ user }: AnnouncementSystemProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const announcements = [
    {
      id: 1,
      title: 'Platform Maintenance Scheduled',
      content: 'We will be performing scheduled maintenance on the platform this Sunday from 2 AM to 6 AM EST. During this time, the platform will be temporarily unavailable.',
      type: 'maintenance',
      priority: 'high',
      targetAudience: 'all',
      createdBy: 'Admin Team',
      createdAt: '2024-01-20T10:00:00Z',
      status: 'published',
      views: 156,
      reactions: 23
    },
    {
      id: 2,
      title: 'New Study Materials Available',
      content: 'Fresh study materials for Advanced React Development have been uploaded by our mentors. Check the study materials section to access the latest resources.',
      type: 'update',
      priority: 'medium',
      targetAudience: 'students',
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-19T14:30:00Z',
      status: 'published',
      views: 89,
      reactions: 45
    },
    {
      id: 3,
      title: 'Mentor Appreciation Week',
      content: 'Join us in celebrating our amazing mentors during Mentor Appreciation Week! Share your success stories and thank your mentors for their guidance.',
      type: 'event',
      priority: 'low',
      targetAudience: 'all',
      createdBy: 'Admin Team',
      createdAt: '2024-01-18T09:15:00Z',
      status: 'draft',
      views: 0,
      reactions: 0
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      maintenance: 'bg-red-100 text-red-800',
      update: 'bg-blue-100 text-blue-800',
      event: 'bg-green-100 text-green-800',
      news: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || colors.news;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcement System</h1>
          <p className="text-gray-600 mt-1">Create and manage platform announcements</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{announcements.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-megaphone-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {announcements.filter(a => a.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {announcements.filter(a => a.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-draft-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {announcements.reduce((sum, a) => sum + a.views, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-eye-line text-xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Announcements</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-800">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(announcement.type)}`}>
                      {announcement.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      announcement.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>By {announcement.createdBy}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                    <span>Target: {announcement.targetAudience}</span>
                    <div className="flex items-center space-x-2">
                      <i className="ri-eye-line"></i>
                      <span>{announcement.views}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-heart-line"></i>
                      <span>{announcement.reactions}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className="p-2 text-gray-400 hover:text-blue-600 cursor-pointer"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-600 cursor-pointer">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 cursor-pointer">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Create New Announcement</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter announcement title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                    <option value="news">News</option>
                    <option value="update">Update</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                    <option value="all">All Users</option>
                    <option value="students">Students Only</option>
                    <option value="mentors">Mentors Only</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your announcement content here..."
                  maxLength={500}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 