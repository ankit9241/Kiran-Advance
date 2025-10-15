'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingManagement from './MeetingManagement';

interface MentorOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
}

export default function MentorOverview({ user }: MentorOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const navigate = useNavigate();

  const stats = {
    assignedStudents: 12,
    pendingDoubts: 8,
    upcomingMeetings: 5,
    materialsUploaded: 24,
    avgRating: 4.8,
    responseTime: '2.3 hours'
  };

  const recentDoubts = [
    {
      id: 1,
      student: 'Alice Johnson',
      subject: 'Data Structures',
      question: 'How to implement a binary search tree efficiently?',
      priority: 'high',
      timeAgo: '30 min ago',
      avatar: 'https://readdy.ai/api/search-image?query=young%20female%20student%20portrait%2C%20friendly%20expression%2C%20academic%20setting%2C%20natural%20lighting&width=40&height=40&seq=student1&orientation=squarish'
    },
    {
      id: 2,
      student: 'John Smith',
      subject: 'Algorithms',
      question: 'Understanding time complexity of recursive functions',
      priority: 'medium',
      timeAgo: '1 hour ago',
      avatar: 'https://readdy.ai/api/search-image?query=young%20male%20student%20portrait%2C%20focused%20expression%2C%20study%20environment%2C%20clean%20background&width=40&height=40&seq=student2&orientation=squarish'
    },
    {
      id: 3,
      student: 'Emma Davis',
      subject: 'Web Development',
      question: 'Best practices for React component optimization',
      priority: 'low',
      timeAgo: '2 hours ago',
      avatar: 'https://readdy.ai/api/search-image?query=female%20computer%20science%20student%20portrait%2C%20confident%20smile%2C%20tech%20background%2C%20modern%20style&width=40&height=40&seq=student3&orientation=squarish'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      student: 'Michael Brown',
      topic: 'Project Review - E-commerce App',
      time: 'Today, 2:00 PM',
      duration: '60 min',
      type: 'video'
    },
    {
      id: 2,
      student: 'Sarah Wilson',
      topic: 'Algorithm Discussion',
      time: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      type: 'video'
    },
    {
      id: 3,
      student: 'David Lee',
      topic: 'Career Guidance',
      time: 'Tomorrow, 3:30 PM',
      duration: '30 min',
      type: 'video'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}</h1>
          <p className="text-gray-600 mt-1">Here's your mentorship overview</p>
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
              <p className="text-sm font-medium text-gray-600">Assigned Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.assignedStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-star-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Doubts</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pendingDoubts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-question-answer-line text-xl text-orange-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.upcomingMeetings}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Materials Uploaded</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.materialsUploaded}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-upload-line text-xl text-purple-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-star-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.responseTime}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-indigo-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Doubts</h2>
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap"
                onClick={() => navigate('/mentor/doubts')}
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentDoubts.map((doubt) => (
              <div
                key={doubt.id}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => navigate(`/mentor/doubts?doubtId=${doubt.id}`)}
              >
                <img
                  src={doubt.avatar}
                  alt={doubt.student}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800">{doubt.student}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(doubt.priority)}`}>
                      {doubt.priority}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mb-1">{doubt.subject}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{doubt.question}</p>
                  <p className="text-xs text-gray-500 mt-2">{doubt.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Meetings</h2>
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap"
                onClick={() => setShowScheduleModal(true)}
              >
                Schedule New
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => navigate(`/mentor/meetings?meetingId=${meeting.id}`)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{meeting.student}</p>
                  <p className="text-sm text-gray-600 mt-1">{meeting.topic}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-blue-600">{meeting.time}</span>
                    <span className="text-xs text-gray-500">{meeting.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-video-line text-green-600"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Optionally, render MeetingManagement modal here if showScheduleModal is true */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto relative my-12">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            <div className="pt-8">
              <MeetingManagement user={user} forceShowScheduleModal={true} onCloseScheduleModal={() => setShowScheduleModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}