
'use client';

import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

interface DashboardOverviewProps {
  user?: User | null;
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  // Provide default user if not provided
  const currentUser = user || {
    id: 'guest',
    name: 'Student',
    email: '',
    role: 'student',
    avatar: undefined
  };
  
  const displayName = currentUser.name || 
    [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ') || 
    'Student';
  const navigate = useNavigate();
  const upcomingMeetings = [
    {
      id: 1,
      title: 'Data Structures Review',
      mentor: 'Dr. Sarah Wilson',
      date: 'Today',
      time: '2:00 PM',
      duration: '60 min',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Project Discussion',
      mentor: 'Prof. James Miller',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '45 min',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Algorithm Analysis',
      mentor: 'Dr. Sarah Wilson',
      date: 'Friday',
      time: '3:30 PM',
      duration: '90 min',
      status: 'scheduled'
    }
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: 'New Study Materials Available',
      content: 'Advanced JavaScript concepts and practice problems have been uploaded.',
      author: 'Dr. Sarah Wilson',
      date: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Midterm Exam Schedule',
      content: 'Midterm examinations will be held from March 15-20. Please check your individual schedules.',
      author: 'Admin Team',
      date: '1 day ago',
      priority: 'normal'
    },
    {
      id: 3,
      title: 'Office Hours Update',
      content: 'Dr. Wilson\'s office hours have been extended to 4 PM on Wednesdays.',
      author: 'Dr. Sarah Wilson',
      date: '3 days ago',
      priority: 'low'
    }
  ];

  const stats = [
    {
      title: 'Active Doubts',
      value: '3',
      icon: 'ri-question-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed Sessions',
      value: '12',
      icon: 'ri-calendar-check-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Study Materials',
      value: '24',
      icon: 'ri-book-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Feedback Given',
      value: '8',
      icon: 'ri-feedback-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's what's happening with your learning journey today.</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-800" suppressHydrationWarning={true}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                <i className={`${stat.icon} text-lg sm:text-xl ${stat.color}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Meetings</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{meeting.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{meeting.mentor}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line"></i>
                      <span>{meeting.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      <span>{meeting.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-timer-line"></i>
                      <span>{meeting.duration}</span>
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {meeting.status === 'upcoming' && (
                    <button className="px-4 py-2 bg-blue-500 text-white text-xs sm:text-sm rounded-full hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                      Join Now
                    </button>
                  )}
                  {meeting.status === 'scheduled' && (
                    <span className="px-4 py-2 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-full">
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Announcements</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1 truncate">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-1">
                      <span className="truncate">By {announcement.author}</span>
                      <span className="flex-shrink-0">{announcement.date}</span>
                    </div>
                  </div>
                  {announcement.priority === 'high' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer group"
            onClick={() => navigate('/student/doubts?openForm=1')}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-question-line text-white text-lg"></i>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-800">Ask a Doubt</p>
              <p className="text-sm text-gray-600 truncate">Get help from mentors</p>
            </div>
          </button>
          {/* New Quick Action: View Mentor Directory */}
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer group"
            onClick={() => navigate('/student/mentors?openDirectory=1')}
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-user-star-line text-white text-lg"></i>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-800">View Mentor Directory</p>
              <p className="text-sm text-gray-600 truncate">Browse and connect with mentors</p>
            </div>
          </button>
          <button
            className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer group"
            onClick={() => navigate('/student/materials?openDownload=1')}
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-download-line text-white text-lg"></i>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-800">Download Materials</p>
              <p className="text-sm text-gray-600 truncate">Access resources</p>
            </div>
          </button>
          <button
            className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer group"
            onClick={() => navigate('/student/feedback?openForm=1')}
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-feedback-line text-white text-lg"></i>
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="font-medium text-gray-800">Give Feedback</p>
              <p className="text-sm text-gray-600 truncate">Share your thoughts</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
