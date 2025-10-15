'use client';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import MentorOverview from '../components/mentor/MentorOverview';
import MentorProfile from '../components/mentor/MentorProfile';
import DoubtQueue from '../components/mentor/DoubtQueue';
import MeetingManagement from '../components/mentor/MeetingManagement';
import StudyMaterialUpload from '../components/mentor/StudyMaterialUpload';
import FeedbackView from '../components/mentor/FeedbackView';
import AssignedStudents from '../components/mentor/AssignedStudents';
import MentorChatWithStudents from '../components/mentor/MentorChatWithStudents';
import Footer from '../components/Footer';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  isVerified: boolean;
}

interface MentorDashboardProps {
  user: User;
  onLogout: () => void;
}

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

const MentorDashboard: React.FC<MentorDashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMessagesSidebar, setShowMessagesSidebar] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [studentsWithUnread] = useState([
    { id: crypto.randomUUID(), name: 'Alice Johnson', unread: 2 },
    { id: crypto.randomUUID(), name: 'Bob Smith', unread: 0 },
    { id: crypto.randomUUID(), name: 'Carol Davis', unread: 1 },
  ]);

  // Check approval status on mount
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch current user data to check approval status
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setIsApproved(userData.isApproved);
        
        // Redirect to pending approval page if not approved
        if (!userData.isApproved) {
          navigate('/mentor/pending-approval');
        }
      } catch (err) {
        console.error('Error checking approval status:', err);
        setError('Failed to verify your account status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkApprovalStatus();
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'React Concepts Review',
      student: { name: 'Alice Johnson', email: 'alice@example.com' },
      date: '2024-07-24',
      time: '10:00 AM',
      duration: 60,
      status: 'scheduled',
      type: 'video',
      description: 'Review React hooks and state management concepts',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      agenda: ['Review useEffect hook', 'Discuss state management', 'Q&A session']
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      student: { name: 'Bob Smith', email: 'bob@example.com' },
      date: '2024-07-23',
      time: '2:00 PM',
      duration: 45,
      status: 'completed',
      type: 'video',
      description: 'Cover array methods and functional programming',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      agenda: ['Array methods deep dive', 'Functional programming concepts']
    },
    {
      id: '3',
      title: 'CSS Layout Workshop',
      student: { name: 'Carol Davis', email: 'carol@example.com' },
      date: '2024-07-25',
      time: '11:00 AM',
      duration: 90,
      status: 'scheduled',
      type: 'video',
      description: 'Hands-on workshop on CSS Grid and Flexbox',
      meetingLink: 'https://meet.google.com/def-ghij-klm',
      agenda: ['CSS Grid basics', 'Flexbox layouts', 'Responsive design']
    }
  ]);

  // Get upcoming meetings (scheduled or in-progress)
  const upcomingMeetings = meetings
    .filter(meeting => ['scheduled', 'in-progress'].includes(meeting.status))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 5); // Limit to 5 upcoming meetings

  // Get recent past meetings (completed or cancelled)
  const recentMeetings = meetings
    .filter(meeting => ['completed', 'cancelled'].includes(meeting.status))
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
    .slice(0, 3); // Show 3 most recent past meetings

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock mentors for chat sidebar
  const chatMentors = [
    { id: '1', name: 'John Smith', avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20computer%20science%20mentor&width=100&height=100' },
    { id: '2', name: 'Emily Johnson', avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor&width=100&height=100' },
  ] as const;

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line', route: '/mentor/dashboard' },
    { id: 'messages', name: 'Messages', icon: 'ri-message-3-line', route: '/mentor/messages' },
    { id: 'students', name: 'Students', icon: 'ri-team-line', route: '/mentor/students' },
    { id: 'doubts', name: 'Doubt Queue', icon: 'ri-question-answer-line', route: '/mentor/doubts' },
    { id: 'meetings', name: 'Meetings', icon: 'ri-calendar-line', route: '/mentor/meetings' },
    { id: 'materials', name: 'Study Materials', icon: 'ri-book-line', route: '/mentor/materials' },
    { id: 'feedback', name: 'Feedback', icon: 'ri-feedback-line', route: '/mentor/feedback' },
  ];
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [recentDoubts] = useState([
    {
      id: '1',
      student: 'Alice Johnson',
      subject: 'React Hooks',
      question: 'How to optimize useEffect with dependencies?',
      timeAgo: '2h ago',
      priority: 'High'
    },
    {
      id: '2',
      student: 'Bob Smith',
      subject: 'TypeScript',
      question: 'Best practices for type definitions in large projects?',
      timeAgo: '1d ago',
      priority: 'Medium'
    }
  ]);

  const [stats] = useState({
    assignedStudents: 24,
    pendingDoubts: 5,
    upcomingMeetings: 3,
    completedSessions: 42,
    studentEngagement: 87,
    averageRating: 4.8,
    materialsUploaded: 18,
    avgRating: 4.8,
    responseTime: '15m'
  });

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current path
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  // Map of route paths to components with proper props
  const routes = [
    { 
      path: 'dashboard', 
      element: <MentorOverview user={user} />,
      title: `Welcome back, ${user.name}`,
      subtitle: "Here's your mentorship overview"
    },
    { 
      path: 'students', 
      element: <AssignedStudents user={user} />,
      title: 'Students',
      subtitle: 'Manage your students'
    },
    { 
      path: 'doubts', 
      element: <DoubtQueue user={user} />,
      title: 'Doubt Queue',
      subtitle: 'Manage student doubts'
    },
    { 
      path: 'meetings', 
      element: <MeetingManagement user={user} />,
      title: 'Meetings',
      subtitle: 'Schedule and manage meetings'
    },
    { 
      path: 'materials', 
      element: <StudyMaterialUpload user={user} />,
      title: 'Study Materials',
      subtitle: 'Upload and manage study materials'
    },
    { 
      path: 'feedback', 
      element: <FeedbackView user={user} />,
      title: 'Feedback',
      subtitle: 'View student feedback'
    },
    { 
      path: 'profile', 
      element: <MentorProfile user={user} onLogout={onLogout} />,
      title: 'Profile',
      subtitle: 'Manage your profile'
    },
    { 
      path: '*', 
      element: <Navigate to="dashboard" replace /> 
    },
  ];

  // Find the current active tab based on the path
  const activeTab = tabs.find(tab => location.pathname.startsWith(tab.route))?.id || 'dashboard';

  // Single useEffect to handle all side effects
  useEffect(() => {
    // Set loading to false since we get user from props
    setLoading(false);
    
    // Redirect /mentor to /mentor/dashboard
    if (location.pathname === '/mentor' || location.pathname === '/mentor/') {
      navigate('/mentor/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Early returns after all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-700">{error}</h3>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure user is a mentor
  if (user.role !== 'mentor') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 relative">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-0
          w-64 bg-white shadow-sm transform lg:transform-none transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-800">Mentor Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.route);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id || location.pathname.includes(tab.route)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${tab.icon} text-lg mr-3`}></i>
                <span className="flex-1">{tab.name}</span>
                {tab.id === 'messages' && studentsWithUnread.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {studentsWithUnread.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">         
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">
                            {route.path === 'dashboard' 
                              ? `Welcome back, ${user.name}` 
                              : tabs.find(tab => tab.id === route.path)?.name || route.path.charAt(0).toUpperCase() + route.path.slice(1)}
                          </h1>
                          <p className="text-gray-600 mt-1">
                            {route.path === 'dashboard' 
                              ? "Here's your mentorship overview" 
                              : `Manage your ${route.path} here`}
                          </p>
                        </div>
                        {route.path === 'dashboard' && (
                          <div className="flex items-center space-x-3">
                            <select 
                              value={selectedTimeframe}
                              onChange={(e) => setSelectedTimeframe(e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                            >
                              <option value="week">This Week</option>
                              <option value="month">This Month</option>
                              <option value="year">This Year</option>
                            </select>
                          </div>
                        )}
                      </div>
                      
                      {route.path === 'dashboard' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Assigned Students</p>
                                  <p className="text-2xl font-bold text-gray-800 mt-2">{stats.assignedStudents}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <i className="ri-team-line text-xl text-blue-600"></i>
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
                                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                                    View All
                                  </button>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="h-96 overflow-y-auto pr-2 -mr-2">
                                  <div className="space-y-4 pr-2">
                                    {recentDoubts.map((doubt, idx) => (
                                      <div key={`${doubt.id}-${idx}`} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0">
                                          {doubt.student.charAt(0)}
                                        </div>
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
                                    {/* Add more dummy items to demonstrate scrolling */}
                                    {Array(5).fill(0).map((_, idx) => {
                                      const doubt = recentDoubts[idx % recentDoubts.length];
                                      return (
                                        <div key={`dummy-${idx}`} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100 opacity-80">
                                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0">
                                            {doubt.student.charAt(0)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                              <p className="text-sm font-medium text-gray-800">More {doubt.student}</p>
                                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(doubt.priority)}`}>
                                                {doubt.priority}
                                              </span>
                                            </div>
                                            <p className="text-xs text-blue-600 mb-1">Additional {doubt.subject} Topic</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">This is an additional doubt item to demonstrate scrolling in the recent doubts section.</p>
                                            <p className="text-xs text-gray-500 mt-2">Just now</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                              <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                  <h2 className="text-lg font-semibold text-gray-800">Recent Meetings</h2>
                                  <button 
                                    onClick={() => navigate('/mentor/meetings')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap"
                                  >
                                    Schedule New
                                  </button>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="space-y-6">
                                  {/* Upcoming Meetings */}
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">UPCOMING</h3>
                                    {upcomingMeetings.length > 0 ? (
                                      <div className="space-y-4">
                                        {upcomingMeetings.map(meeting => (
                                          <div key={meeting.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                                                <p className="text-sm text-gray-600">{meeting.student.name}</p>
                                              </div>
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                                {meeting.status.replace('-', ' ')}
                                              </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                              <p>{new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {meeting.time}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No upcoming meetings scheduled</p>
                                    )}
                                  </div>
                                  
                                  {/* Recent Meetings */}
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">RECENT</h3>
                                    {recentMeetings.length > 0 ? (
                                      <div className="space-y-4">
                                        {recentMeetings.map(meeting => (
                                          <div key={meeting.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                                                <p className="text-sm text-gray-600">{meeting.student.name}</p>
                                              </div>
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                                                {meeting.status.replace('-', ' ')}
                                              </span>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-600">
                                              <p>{new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {meeting.time}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No recent meetings</p>
                                    )}
                                  </div>
                                  
                                  <div className="pt-2">
                                    <Link 
                                      to="/mentor/meetings"
                                      className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                                    >
                                      View all meetings <i className="ri-arrow-right-line ml-1"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {route.path !== 'dashboard' && route.element}
                    </div>
                  }
                />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;