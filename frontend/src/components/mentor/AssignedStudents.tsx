'use client';

import { useState } from 'react';
import MeetingManagement from './MeetingManagement';

interface AssignedStudentsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
}

export default function AssignedStudents({ user }: AssignedStudentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    studentId: '',
    subject: '',
    rating: 5,
    strengths: '',
    improvements: '',
    recommendations: ''
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingStudent, setMeetingStudent] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Mock data for assigned students
  const students = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@student.com',
      phone: '+1 (555) 111-2222',
      avatar: 'https://readdy.ai/api/search-image?query=young%20female%20student%20with%20brown%20hair%2C%20friendly%20smile%2C%20casual%20clothing%2C%20bright%20background%2C%20portrait%20style&width=300&height=300&seq=student1&orientation=squarish',
      enrollmentDate: '2024-01-15',
      program: 'Computer Science',
      year: 'Sophomore',
      gpa: 3.8,
      subjects: ['Data Structures', 'Algorithms', 'Database Systems'],
      doubts: {
        total: 15,
        resolved: 12,
        pending: 3
      },
      meetings: {
        completed: 8,
        upcoming: 2,
        totalHours: 16
      },
      progress: {
        assignments: { completed: 18, total: 20 },
        quizzes: { passed: 12, total: 15 },
        projects: { submitted: 3, total: 4 }
      },
      recentActivity: [
        { type: 'doubt', title: 'Binary Search Tree Implementation', date: '2024-03-10' },
        { type: 'meeting', title: 'Algorithm Review Session', date: '2024-03-08' },
        { type: 'assignment', title: 'Graph Algorithms Assignment', date: '2024-03-05' }
      ],
      strengths: ['Quick learner', 'Good problem-solving skills', 'Active participation'],
      areasForImprovement: ['Code optimization', 'Time complexity analysis'],
      overallProgress: 85
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@student.com',
      phone: '+1 (555) 222-3333',
      avatar: 'https://readdy.ai/api/search-image?query=young%20male%20student%20with%20short%20hair%2C%20confident%20expression%2C%20casual%20shirt%2C%20bright%20background%2C%20portrait%20style&width=300&height=300&seq=student2&orientation=squarish',
      enrollmentDate: '2024-02-01',
      program: 'Software Engineering',
      year: 'Junior',
      gpa: 3.6,
      subjects: ['Web Development', 'JavaScript', 'React'],
      doubts: {
        total: 22,
        resolved: 18,
        pending: 4
      },
      meetings: {
        completed: 12,
        upcoming: 1,
        totalHours: 20
      },
      progress: {
        assignments: { completed: 14, total: 16 },
        quizzes: { passed: 10, total: 12 },
        projects: { submitted: 5, total: 6 }
      },
      recentActivity: [
        { type: 'project', title: 'React E-commerce App', date: '2024-03-12' },
        { type: 'doubt', title: 'Redux State Management', date: '2024-03-09' },
        { type: 'meeting', title: 'Code Review Session', date: '2024-03-07' }
      ],
      strengths: ['Creative thinking', 'UI/UX skills', 'Team collaboration'],
      areasForImprovement: ['Backend development', 'Database design'],
      overallProgress: 78
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@student.com',
      phone: '+1 (555) 333-4444',
      avatar: 'https://readdy.ai/api/search-image?query=young%20female%20student%20with%20blonde%20hair%2C%20thoughtful%20expression%2C%20academic%20setting%2C%20bright%20background%2C%20portrait%20style&width=300&height=300&seq=student3&orientation=squarish',
      enrollmentDate: '2024-01-20',
      program: 'Data Science',
      year: 'Senior',
      gpa: 3.9,
      subjects: ['Machine Learning', 'Statistics', 'Python'],
      doubts: {
        total: 11,
        resolved: 10,
        pending: 1
      },
      meetings: {
        completed: 15,
        upcoming: 3,
        totalHours: 25
      },
      progress: {
        assignments: { completed: 22, total: 24 },
        quizzes: { passed: 18, total: 20 },
        projects: { submitted: 4, total: 4 }
      },
      recentActivity: [
        { type: 'project', title: 'Neural Network Implementation', date: '2024-03-11' },
        { type: 'assignment', title: 'Data Preprocessing Pipeline', date: '2024-03-09' },
        { type: 'meeting', title: 'Thesis Discussion', date: '2024-03-06' }
      ],
      strengths: ['Analytical thinking', 'Research skills', 'Mathematical aptitude'],
      areasForImprovement: ['Data visualization', 'Model deployment'],
      overallProgress: 92
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'doubt': return 'ri-question-line';
      case 'meeting': return 'ri-video-line';
      case 'assignment': return 'ri-file-text-line';
      case 'project': return 'ri-code-line';
      default: return 'ri-circle-line';
    }
  };

  const handleGiveFeedback = (studentId: string) => {
    setFeedback(prev => ({ ...prev, studentId }));
    setShowFeedbackModal(true);
  };

  const handleScheduleMeeting = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setMeetingStudent(student);
      setShowScheduleModal(true);
    }
  };

  const handleSubmitFeedback = () => {
    console.log('Submitting feedback:', feedback);
    setShowFeedbackModal(false);
    setFeedback({
      studentId: '',
      subject: '',
      rating: 5,
      strengths: '',
      improvements: '',
      recommendations: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Students</h1>
        <div className="text-sm text-gray-600">
          {filteredStudents.length} students assigned
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <div className="absolute left-3 top-2.5 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            {/* Schedule Meeting Button */}
            <button
              onClick={e => { e.stopPropagation(); handleScheduleMeeting(student.id); }}
              className="absolute top-4 right-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-2 shadow-sm transition-colors"
              title="Schedule Meeting"
            >
              <i className="ri-calendar-line text-lg"></i>
            </button>
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-600">{student.program} • {student.year}</p>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Subjects</h4>
              <div className="flex flex-wrap gap-1">
                {student.subjects.map((subject, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{student.doubts.resolved}/{student.doubts.total}</div>
                <div className="text-xs text-gray-600">Doubts Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">{student.meetings.completed}</div>
                <div className="text-xs text-gray-600">Meetings</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedStudent(student.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                View Profile
              </button>
              <button
                onClick={() => handleGiveFeedback(student.id)}
                className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Give Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const student = students.find(s => s.id === selectedStudent);
              if (!student) return null;

              return (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gray-800">Student Profile</h2>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="flex items-start space-x-6">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{student.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                          <div><span className="font-medium">Email:</span> {student.email}</div>
                          <div><span className="font-medium">Phone:</span> {student.phone}</div>
                          <div><span className="font-medium">Program/Stream:</span> {student.program}</div>
                          <div><span className="font-medium">Year/Class:</span> {student.year}</div>
                          <div><span className="font-medium">Enrollment Date:</span> {new Date(student.enrollmentDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div>
                      <h4 className="text-base font-semibold text-blue-700 mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {student.subjects.map((subject, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Strengths and Areas for Improvement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base font-semibold text-green-700 mb-3">Strengths</h4>
                        <ul className="space-y-2">
                          {student.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <i className="ri-check-line text-green-500"></i>
                              <span className="text-gray-800">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-orange-700 mb-3">Areas for Improvement</h4>
                        <ul className="space-y-2">
                          {student.areasForImprovement.map((area, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <i className="ri-arrow-right-line text-orange-500"></i>
                              <span className="text-gray-800">{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h4 className="text-base font-semibold text-purple-700 mb-2">Recent Activity</h4>
                      <div className="space-y-2">
                        {student.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <i className={`${getActivityIcon(activity.type)} text-gray-500`}></i>
                            </div>
                            <span className="text-gray-800 truncate">{activity.title}</span>
                            <span className="text-gray-500 text-xs">{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Give Student Feedback</h2>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Topic
                </label>
                <input
                  type="text"
                  value={feedback.subject}
                  onChange={(e) => setFeedback(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Data Structures Assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedback(prev => ({ ...prev, rating }))}
                      className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                        rating <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <i className="ri-star-fill text-xl"></i>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({feedback.rating}/5)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strengths
                </label>
                <textarea
                  value={feedback.strengths}
                  onChange={(e) => setFeedback(prev => ({ ...prev, strengths: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="What did the student do well?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement
                </label>
                <textarea
                  value={feedback.improvements}
                  onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="What areas need more work?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </label>
                <textarea
                  value={feedback.recommendations}
                  onChange={(e) => setFeedback(prev => ({ ...prev, recommendations: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="What should the student do next?"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MeetingManagement Modal */}
      {showScheduleModal && meetingStudent && (
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