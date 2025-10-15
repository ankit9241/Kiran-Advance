'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface Meeting {
  id: string;
  title: string;
  student: { name: string; email: string };
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'video' | 'audio' | 'in-person';
  description: string;
  meetingLink: string;
  agenda: string[];
  notes?: string;
}

interface MeetingManagementProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
  viewMode?: 'upcoming' | 'past' | 'all';
  showOnlyUpcoming?: boolean;
  className?: string;
  forceShowScheduleModal?: boolean;
  onCloseScheduleModal?: () => void;
  prefillStudent?: { name: string; email: string } | null;
}

export default function MeetingManagement({ 
  user, 
  viewMode = 'all',
  showOnlyUpcoming = false,
  className = '',
  forceShowScheduleModal = false, 
  onCloseScheduleModal, 
  prefillStudent 
}: MeetingManagementProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(forceShowScheduleModal);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [internalViewMode, setInternalViewMode] = useState<'upcoming' | 'past' | 'all'>(viewMode);
  
  // Update internal view mode when prop changes
  useEffect(() => {
    if (viewMode) {
      setInternalViewMode(viewMode);
    }
  }, [viewMode]);
  const [highlightedMeetingId, setHighlightedMeetingId] = useState<string | null>(null);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const meetingId = params.get('meetingId');
    if (meetingId) {
      setHighlightedMeetingId(meetingId);
      // Remove highlight after 1.5 seconds
      const timeout = setTimeout(() => setHighlightedMeetingId(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [location.search]);

  useEffect(() => {
    if (forceShowScheduleModal) setShowScheduleModal(true);
  }, [forceShowScheduleModal]);

  useEffect(() => {
    if (showScheduleModal && prefillStudent) {
      setNewMeeting((prev) => ({
        ...prev,
        studentEmail: prefillStudent.email,
        title: prev.title || `Session with ${prefillStudent.name}`
      }));
    }
  }, [showScheduleModal, prefillStudent]);

  // Mock meetings data
  const meetings = [
    {
      id: uuidv4(),
      title: 'React Concepts Review',
      student: { name: 'Alice Johnson', email: 'alice@example.com' },
      date: '2024-01-22',
      time: '10:00 AM',
      duration: 60,
      status: 'scheduled',
      type: 'video',
      description: 'Review React hooks and state management concepts',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      agenda: ['Review useEffect hook', 'Discuss state management', 'Q&A session'],
      notes: ''
    },
    {
      id: uuidv4(),
      title: 'JavaScript Fundamentals',
      student: { name: 'Bob Smith', email: 'bob@example.com' },
      date: '2024-01-23',
      time: '2:00 PM',
      duration: 45,
      status: 'scheduled',
      type: 'video',
      description: 'Cover array methods and functional programming',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      agenda: ['Array methods deep dive', 'Functional programming concepts', 'Practice exercises'],
      notes: ''
    },
    {
      id: uuidv4(),
      title: 'Weekly Progress Check',
      student: { name: 'Carol Davis', email: 'carol@example.com' },
      date: '2024-01-19',
      time: '11:00 AM',
      duration: 30,
      status: 'completed',
      type: 'video',
      description: 'Weekly progress review and planning',
      meetingLink: 'https://meet.google.com/def-ghij-klm',
      agenda: ['Progress review', 'Next week planning', 'Resource recommendations'],
      notes: 'Carol is making excellent progress. Recommended advanced React resources.'
    },
    {
      id: uuidv4(),
      title: 'Code Review Session',
      student: { name: 'David Wilson', email: 'david@example.com' },
      date: '2024-01-18',
      time: '3:30 PM',
      duration: 60,
      status: 'completed',
      type: 'video',
      description: 'Review student\'s project code and provide feedback',
      meetingLink: 'https://meet.google.com/nop-qrst-uvw',
      agenda: ['Project code review', 'Best practices discussion', 'Performance optimization'],
      notes: 'Identified areas for improvement in code structure. Student is receptive to feedback.'
    },
    {
      id: uuidv4(),
      title: 'CSS Layout Workshop',
      student: { name: 'Alice Johnson', email: 'alice@example.com' },
      date: '2024-01-17',
      time: '1:00 PM',
      duration: 90,
      status: 'cancelled',
      type: 'video',
      description: 'Hands-on workshop on CSS Grid and Flexbox',
      meetingLink: 'https://meet.google.com/ghi-jklm-nop',
      agenda: ['CSS Grid basics', 'Flexbox layouts', 'Responsive design'],
      notes: 'Cancelled due to student illness. Rescheduled for next week.'
    }
  ];

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    studentEmail: '',
    date: '',
    time: '',
    duration: 60,
    description: '',
    agenda: ['']
  });

  const filteredMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    
    // If showOnlyUpcoming is true, only show upcoming meetings
    if (showOnlyUpcoming) {
      return meetingDate >= today && meeting.status === 'scheduled';
    }
    
    // Otherwise, respect the viewMode prop
    const currentViewMode = showOnlyUpcoming ? 'upcoming' : internalViewMode;
    
    switch (currentViewMode) {
      case 'upcoming':
        return meetingDate >= today && meeting.status === 'scheduled';
      case 'past':
        return meetingDate < today || meeting.status === 'completed' || meeting.status === 'cancelled';
      case 'all':
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleMeeting = () => {
    console.log('Scheduling meeting:', newMeeting);
    setShowScheduleModal(false);
    setNewMeeting({
      title: '',
      studentEmail: '',
      date: '',
      time: '',
      duration: 60,
      description: '',
      agenda: ['']
    });
    // Do NOT setSelectedMeeting or open any other modal here
  };

  const addAgendaItem = () => {
    setNewMeeting({
      ...newMeeting,
      agenda: [...newMeeting.agenda, '']
    });
  };

  const updateAgendaItem = (index: number, value: string) => {
    const updatedAgenda = [...newMeeting.agenda];
    updatedAgenda[index] = value;
    setNewMeeting({
      ...newMeeting,
      agenda: updatedAgenda
    });
  };

  const removeAgendaItem = (index: number) => {
    setNewMeeting({
      ...newMeeting,
      agenda: newMeeting.agenda.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meeting Management</h1>
            <p className="text-gray-600 mt-1">Schedule and manage your mentoring sessions</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {!showOnlyUpcoming && [
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'past', label: 'Past' },
                { key: 'all', label: 'All' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setInternalViewMode(mode.key as 'upcoming' | 'past' | 'all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    internalViewMode === mode.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className={`bg-white rounded-lg shadow-sm p-6 transition-all duration-300 ${highlightedMeetingId === meeting.id ? 'shadow-2xl scale-105 z-10' : ''}`}
            style={highlightedMeetingId === meeting.id ? { boxShadow: '0 8px 32px 0 rgba(0, 80, 255, 0.25)' } : {}}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                <p className="text-sm text-gray-600">{meeting.student.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-calendar-line"></i>
                </div>
                <span>{new Date(meeting.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-time-line"></i>
                </div>
                <span>{meeting.time} ({meeting.duration} min)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-video-line"></i>
                </div>
                <span>{meeting.type}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">{meeting.description}</p>

            <div className="flex space-x-2">
              {meeting.status === 'scheduled' && (
                <>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap text-sm">
                    <i className="ri-video-line mr-1"></i>
                    Join
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-sm">
                    <i className="ri-edit-line mr-1"></i>
                    Edit
                  </button>
                </>
              )}
              {meeting.status === 'completed' && (
                <button 
                  onClick={() => setSelectedMeeting(meeting.id)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-eye-line mr-1"></i>
                  View Notes
                </button>
              )}
              {meeting.status === 'cancelled' && (
                <button className="flex-1 bg-gray-400 text-white py-2 px-3 rounded-lg cursor-not-allowed text-sm">
                  Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto my-12">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Schedule New Meeting</h2>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    if (onCloseScheduleModal) onCloseScheduleModal();
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-close-line text-xl"></i>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Email</label>
                  <input
                    type="email"
                    value={newMeeting.studentEmail}
                    onChange={(e) => setNewMeeting({...newMeeting, studentEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the meeting purpose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                <div className="space-y-2">
                  {newMeeting.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateAgendaItem(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Agenda item ${index + 1}`}
                      />
                      {newMeeting.agenda.length > 1 && (
                        <button
                          onClick={() => removeAgendaItem(index)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            <i className="ri-delete-bin-line"></i>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAgendaItem}
                    className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Add agenda item
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            {(() => {
              const meeting = meetings.find(m => m.id === selectedMeeting);
              if (!meeting) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">{meeting.title}</h2>
                      <button
                        onClick={() => setSelectedMeeting(null)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <div className="w-6 h-6 flex items-center justify-center">
                          <i className="ri-close-line text-xl"></i>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Student</label>
                        <p className="text-gray-900">{meeting.student.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                        <p className="text-gray-900">{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
                      <ul className="list-disc list-inside space-y-1">
                        {meeting.agenda.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {meeting.notes || 'No notes available for this meeting.'}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}