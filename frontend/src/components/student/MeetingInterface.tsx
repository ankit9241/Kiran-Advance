'use client';

import { useState } from 'react';

interface MeetingInterfaceProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function MeetingInterface({ user }: MeetingInterfaceProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    mentor: '',
    date: '',
    time: '',
    duration: '60',
    topic: '',
    priority: 'medium'
  });

  const meetings = [
    {
      id: 1,
      title: 'Data Structures Review Session',
      description: 'Review of binary trees, hash tables, and graph algorithms with practical examples.',
      mentor: {
        name: 'Dr. Sarah Wilson',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20portrait%20with%20glasses%2C%20confident%20expression%2C%20clean%20background%2C%20academic%20style&width=60&height=60&seq=mentor-small&orientation=squarish',
        expertise: 'Data Structures & Algorithms'
      },
      date: '2024-03-15',
      time: '14:00',
      duration: 60,
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      topic: 'Data Structures',
      priority: 'high',
      agenda: ['Binary Search Trees', 'Hash Table Implementation', 'Graph Traversal Algorithms'],
      materials: ['DSA_Notes.pdf', 'Practice_Problems.zip']
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      description: 'Advanced discussion on useEffect, useCallback, useMemo, and custom hooks.',
      mentor: {
        name: 'Prof. James Miller',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20professor%20with%20beard%2C%20friendly%20expression%2C%20clean%20background%2C%20academic%20style&width=60&height=60&seq=prof-small&orientation=squarish',
        expertise: 'Web Development'
      },
      date: '2024-03-16',
      time: '10:00',
      duration: 45,
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/xyz-uvwx-yz',
      topic: 'React Development',
      priority: 'medium',
      agenda: ['Hook Rules', 'Performance Optimization', 'Custom Hook Creation'],
      materials: ['React_Hooks_Guide.pdf']
    },
    {
      id: 3,
      title: 'Database Optimization Techniques',
      description: 'Completed session on SQL query optimization and indexing strategies.',
      mentor: {
        name: 'Dr. Sarah Wilson',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20portrait%20with%20glasses%2C%20confident%20expression%2C%20clean%20background%2C%20academic%20style&width=60&height=60&seq=mentor-small2&orientation=squarish',
        expertise: 'Database Systems'
      },
      date: '2024-03-10',
      time: '15:30',
      duration: 90,
      status: 'completed',
      topic: 'Database',
      priority: 'medium',
      agenda: ['Query Optimization', 'Index Strategies', 'Performance Monitoring'],
      materials: ['Database_Optimization.pdf', 'SQL_Examples.sql'],
      feedback: {
        rating: 5,
        comment: 'Excellent session! Very clear explanations of complex concepts.'
      },
      recording: 'https://recordings.example.com/session-123'
    },
    {
      id: 4,
      title: 'Machine Learning Project Review',
      description: 'Review of neural network implementation and model evaluation techniques.',
      mentor: {
        name: 'Dr. Emily Rodriguez',
        avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20data%20scientist%20with%20long%20hair%2C%20confident%20expression%2C%20clean%20background%2C%20modern%20style&width=60&height=60&seq=emily-small&orientation=squarish',
        expertise: 'Machine Learning'
      },
      date: '2024-03-08',
      time: '11:00',
      duration: 75,
      status: 'completed',
      topic: 'Machine Learning',
      priority: 'high',
      agenda: ['Model Architecture Review', 'Training Process Analysis', 'Evaluation Metrics'],
      materials: ['ML_Project_Feedback.pdf', 'Model_Improvements.py'],
      feedback: {
        rating: 4,
        comment: 'Good session, would like more hands-on coding examples next time.'
      },
      recording: 'https://recordings.example.com/session-124'
    }
  ];

  const mentors = [
    { name: 'Dr. Sarah Wilson', expertise: 'Data Structures & Algorithms' },
    { name: 'Prof. James Miller', expertise: 'Web Development' },
    { name: 'Dr. Emily Rodriguez', expertise: 'Machine Learning' },
    { name: 'Prof. Michael Chen', expertise: 'System Design' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeeting.title && newMeeting.mentor && newMeeting.date && newMeeting.time) {
      console.log('Scheduling meeting:', newMeeting);
      setShowScheduleForm(false);
      setNewMeeting({
        title: '',
        description: '',
        mentor: '',
        date: '',
        time: '',
        duration: '60',
        topic: '',
        priority: 'medium'
      });
    }
  };

  const isUpcoming = (date: string, time: string) => {
    const meetingDateTime = new Date(`${date}T${time}`);
    return meetingDateTime > new Date();
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Meeting Interface</h1>
        {/* Schedule Meeting button removed for students */}
      </div>

      {/* Remove schedule meeting form and logic below */}
      {false && showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Schedule New Meeting</h3>
              <button 
                onClick={() => setShowScheduleForm(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleScheduleMeeting}>
              {/* form fields removed */}
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upcoming', name: 'Upcoming', count: meetings.filter(m => m.status === 'upcoming').length },
              { id: 'completed', name: 'Completed', count: meetings.filter(m => m.status === 'completed').length },
              { id: 'all', name: 'All Meetings', count: meetings.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {meetings
              .filter(meeting => {
                if (activeTab === 'all') return true;
                return meeting.status === activeTab;
              })
              .map((meeting) => {
                const { date, time } = formatDateTime(meeting.date, meeting.time);
                const canJoin = isUpcoming(meeting.date, meeting.time) && 
                              meeting.status === 'upcoming' && 
                              new Date(`${meeting.date}T${meeting.time}`) <= new Date(Date.now() + 15 * 60 * 1000);

                return (
                  <div 
                    key={meeting.id} 
                    className={`border-l-4 ${getPriorityColor(meeting.priority)} bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{meeting.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center space-x-1">
                            <i className="ri-calendar-line"></i>
                            <span>{date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="ri-time-line"></i>
                            <span>{time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="ri-timer-line"></i>
                            <span>{meeting.duration} min</span>
                          </span>
                          {meeting.topic && (
                            <span className="flex items-center space-x-1">
                              <i className="ri-bookmark-line"></i>
                              <span>{meeting.topic}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={meeting.mentor.avatar}
                            alt={meeting.mentor.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{meeting.mentor.name}</p>
                            <p className="text-sm text-gray-600">{meeting.mentor.expertise}</p>
                          </div>
                        </div>

                        {meeting.agenda && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-2">Agenda:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {meeting.agenda.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <i className="ri-checkbox-line text-blue-500"></i>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {meeting.materials && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-2">Materials:</h4>
                            <div className="flex flex-wrap gap-2">
                              {meeting.materials.map((material, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1">
                                  <i className="ri-file-line"></i>
                                  <span>{material}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {meeting.feedback && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-green-800">Feedback:</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`ri-star-${i < meeting.feedback!.rating ? 'fill' : 'line'} text-yellow-500 text-sm`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-green-700">{meeting.feedback.comment}</p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col space-y-2">
                        {canJoin && (
                          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <i className="ri-video-line"></i>
                              <span>Join Now</span>
                            </div>
                          </button>
                        )}
                        
                        {meeting.status === 'upcoming' && !canJoin && (
                          <div className="text-center">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap mb-2">
                              <div className="flex items-center space-x-2">
                                <i className="ri-calendar-event-line"></i>
                                <span>Add to Calendar</span>
                              </div>
                            </button>
                            <p className="text-xs text-gray-500">Join available 15 min before</p>
                          </div>
                        )}

                        {meeting.status === 'completed' && (
                          <div className="space-y-2">
                            {meeting.recording && (
                              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <i className="ri-play-circle-line"></i>
                                  <span>View Recording</span>
                                </div>
                              </button>
                            )}
                            {!meeting.feedback && (
                              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <i className="ri-feedback-line"></i>
                                  <span>Give Feedback</span>
                                </div>
                              </button>
                            )}
                          </div>
                        )}

                        <button className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <i className="ri-more-line"></i>
                            <span>Details</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {meetings.filter(meeting => {
            if (activeTab === 'all') return true;
            return meeting.status === activeTab;
          }).length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No meetings found</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming meetings." 
                  : activeTab === 'completed'
                  ? "No completed meetings yet."
                  : "You haven't scheduled any meetings yet."}
              </p>
              {/* Schedule Your First Meeting button removed for students */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}