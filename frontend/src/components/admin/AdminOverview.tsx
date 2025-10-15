'use client';

import { useState } from 'react';

interface AdminOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function AdminOverview({ user }: AdminOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const stats = {
    totalUsers: 156,
    activeStudents: 98,
    activeMentors: 24,
    pendingApprovals: 12,
    totalMeetings: 234,
    avgSatisfaction: 4.7
  };

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New mentor Sarah Wilson registered',
      time: '15 min ago',
      icon: 'ri-user-add-line',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'meeting_completed',
      message: 'Meeting completed between Alice and Dr. Brown',
      time: '1 hour ago',
      icon: 'ri-calendar-check-line',
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'material_upload',
      message: 'New study material uploaded by mentor John',
      time: '2 hours ago',
      icon: 'ri-upload-line',
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'feedback_received',
      message: 'Student feedback received for platform improvement',
      time: '3 hours ago',
      icon: 'ri-feedback-line',
      color: 'text-orange-600'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'mentor',
      name: 'Dr. Emily Carter',
      email: 'emily.carter@university.edu',
      specialization: 'Machine Learning',
      experience: '8 years',
      status: 'pending'
    },
    {
      id: 2,
      type: 'material',
      title: 'Advanced React Patterns',
      mentor: 'John Smith',
      subject: 'Web Development',
      uploadDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: 3,
      type: 'mentor',
      name: 'Prof. Michael Zhang',
      email: 'michael.zhang@tech.edu',
      specialization: 'Data Science',
      experience: '12 years',
      status: 'pending'
    }
  ];

  const platformStats = [
    { label: 'Total Meetings This Month', value: '67', change: '+12%', trend: 'up' },
    { label: 'Average Session Duration', value: '45 min', change: '+3 min', trend: 'up' },
    { label: 'Student Satisfaction Rate', value: '94%', change: '+2%', trend: 'up' },
    { label: 'Mentor Response Time', value: '2.1 hrs', change: '-0.3 hrs', trend: 'down' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform management and oversight</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Mentors</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.activeMentors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-star-line text-xl text-purple-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pendingApprovals}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-orange-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-xl text-indigo-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.avgSatisfaction}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-star-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <div className={`flex items-center text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <i className={`${stat.trend === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
                {stat.change}
              </div>
            </div>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                View All Logs
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100`}>
                  <i className={`${activity.icon} ${activity.color}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Pending Approvals</h2>
              <span className="text-sm text-orange-600 font-medium">{stats.pendingApprovals} pending</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      approval.type === 'mentor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {approval.type}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {approval.type === 'mentor' ? approval.name : approval.title}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {approval.type === 'mentor' ? (
                    <>
                      <p>Email: {approval.email}</p>
                      <p>Specialization: {approval.specialization}</p>
                      <p>Experience: {approval.experience}</p>
                    </>
                  ) : (
                    <>
                      <p>Mentor: {approval.mentor}</p>
                      <p>Subject: {approval.subject}</p>
                      <p>Upload Date: {approval.uploadDate}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors cursor-pointer whitespace-nowrap">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap">
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 