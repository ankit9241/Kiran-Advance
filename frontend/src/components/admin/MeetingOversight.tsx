'use client';

import { useState } from 'react';

interface MeetingOversightProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function MeetingOversight({ user }: MeetingOversightProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);

  const meetings = [
    {
      id: 1,
      title: 'React Advanced Concepts',
      student: 'Emma Watson',
      mentor: 'Dr. Sarah Johnson',
      date: '2024-01-25',
      time: '14:00',
      duration: 60,
      status: 'completed',
      type: 'video',
      subject: 'Web Development',
      studentAvatar: 'https://readdy.ai/api/search-image?query=professional%20young%20woman%20student%20with%20books%20and%20laptop%20in%20modern%20university%20setting%2C%20bright%20natural%20lighting%2C%20educational%20environment&width=40&height=40&seq=student1&orientation=squarish',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20with%20glasses%20in%20modern%20classroom%20setting%2C%20warm%20lighting%2C%20educational%20professional%20environment&width=40&height=40&seq=mentor1&orientation=squarish',
      feedback: {
        student: 4.5,
        mentor: 4.8,
        comments: 'Great session, very helpful'
      }
    },
    {
      id: 2,
      title: 'Data Structures Deep Dive',
      student: 'Michael Chen',
      mentor: 'Prof. David Wilson',
      date: '2024-01-26',
      time: '10:00',
      duration: 45,
      status: 'scheduled',
      type: 'video',
      subject: 'Computer Science',
      studentAvatar: 'https://readdy.ai/api/search-image?query=young%20male%20student%20with%20backpack%20and%20notebook%20in%20university%20campus%20setting%2C%20natural%20daylight%2C%20educational%20atmosphere&width=40&height=40&seq=student2&orientation=squarish',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20male%20professor%20with%20beard%20in%20academic%20office%20setting%2C%20scholarly%20books%20background%2C%20warm%20professional%20lighting&width=40&height=40&seq=mentor2&orientation=squarish',
      feedback: null
    },
    {
      id: 3,
      title: 'Algorithm Problem Solving',
      student: 'Lisa Park',
      mentor: 'Dr. Sarah Johnson',
      date: '2024-01-26',
      time: '16:30',
      duration: 90,
      status: 'in-progress',
      type: 'video',
      subject: 'Mathematics',
      studentAvatar: 'https://readdy.ai/api/search-image?query=focused%20asian%20female%20student%20studying%20with%20computer%20science%20books%20in%20library%20setting%2C%20natural%20academic%20lighting&width=40&height=40&seq=student3&orientation=squarish',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20with%20glasses%20in%20modern%20classroom%20setting%2C%20warm%20lighting%2C%20educational%20professional%20environment&width=40&height=40&seq=mentor1&orientation=squarish',
      feedback: null
    },
    {
      id: 4,
      title: 'Career Guidance Session',
      student: 'James Rodriguez',
      mentor: 'Prof. David Wilson',
      date: '2024-01-24',
      time: '13:00',
      duration: 30,
      status: 'cancelled',
      type: 'audio',
      subject: 'Career Development',
      studentAvatar: 'https://readdy.ai/api/search-image?query=young%20hispanic%20male%20student%20with%20laptop%20and%20textbooks%20in%20modern%20study%20space%2C%20bright%20educational%20environment&width=40&height=40&seq=student4&orientation=squarish',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20male%20professor%20with%20beard%20in%20academic%20office%20setting%2C%20scholarly%20books%20background%2C%20warm%20professional%20lighting&width=40&height=40&seq=mentor2&orientation=squarish',
      feedback: null
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (activeTab === 'all') return true;
    return meeting.status === activeTab;
  });

  const stats = {
    total: meetings.length,
    completed: meetings.filter(m => m.status === 'completed').length,
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    inProgress: meetings.filter(m => m.status === 'in-progress').length,
    cancelled: meetings.filter(m => m.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meeting Oversight</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all platform meetings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
            Export Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-check-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-play-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.cancelled}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-close-line text-xl text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">All Meetings</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'all', name: 'All', count: stats.total },
                { id: 'completed', name: 'Completed', count: stats.completed },
                { id: 'scheduled', name: 'Scheduled', count: stats.scheduled },
                { id: 'in-progress', name: 'In Progress', count: stats.inProgress },
                { id: 'cancelled', name: 'Cancelled', count: stats.cancelled }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{meeting.title}</div>
                      <div className="text-sm text-gray-500">{meeting.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <img
                          src={meeting.studentAvatar}
                          alt={meeting.student}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-900">{meeting.student}</span>
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Student</span>
                      </div>
                      <div className="flex items-center">
                        <img
                          src={meeting.mentorAvatar}
                          alt={meeting.mentor}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm text-gray-900">{meeting.mentor}</span>
                        <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Mentor</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{meeting.date}</div>
                    <div className="text-sm text-gray-500">{meeting.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {meeting.duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedMeeting(meeting)}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      View
                    </button>
                    {meeting.status === 'scheduled' && (
                      <button className="text-red-600 hover:text-red-700 cursor-pointer">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Meeting Details</h3>
              <button 
                onClick={() => setSelectedMeeting(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                  <p className="text-gray-900">{selectedMeeting.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900">{selectedMeeting.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <p className="text-gray-900">{selectedMeeting.date} at {selectedMeeting.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <p className="text-gray-900">{selectedMeeting.duration} minutes</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800">Participants</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={selectedMeeting.studentAvatar}
                        alt={selectedMeeting.student}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedMeeting.student}</p>
                        <p className="text-sm text-blue-600">Student</p>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={selectedMeeting.mentorAvatar}
                        alt={selectedMeeting.mentor}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedMeeting.mentor}</p>
                        <p className="text-sm text-purple-600">Mentor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMeeting.feedback && (
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-800">Feedback</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Student Rating</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`ri-star-${star <= selectedMeeting.feedback.student ? 'fill' : 'line'} text-yellow-400`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({selectedMeeting.feedback.student})</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mentor Rating</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`ri-star-${star <= selectedMeeting.feedback.mentor ? 'fill' : 'line'} text-yellow-400`}
                            ></i>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({selectedMeeting.feedback.mentor})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-900">{selectedMeeting.feedback.comments}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
                {selectedMeeting.status === 'scheduled' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                    Cancel Meeting
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 