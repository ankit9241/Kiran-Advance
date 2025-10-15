import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import AnnouncementSystem from '../components/admin/AnnouncementSystem';
import MeetingOversight from '../components/admin/MeetingOversight';
import MaterialApproval from '../components/admin/MaterialApproval';
import MentorApproval from '../components/admin/MentorApproval';
import FeedbackAnalytics from '../components/admin/FeedbackAnalytics';
import NotificationComposer from '../components/admin/NotificationComposer';
import StudyMaterialUpload from '../components/mentor/StudyMaterialUpload';
import Footer from '../components/Footer';
import { FiMenu, FiX } from 'react-icons/fi';

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when navigating to a new route
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) && 
          menuButton && 
          !menuButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line', route: '/admin/dashboard' },
    { id: 'users', name: 'User Management', icon: 'ri-team-line', route: '/admin/users' },
    { id: 'announcements', name: 'Announcements', icon: 'ri-megaphone-line', route: '/admin/announcements' },
    { id: 'meetings', name: 'Meeting Oversight', icon: 'ri-calendar-check-line', route: '/admin/meetings' },
    { id: 'materials', name: 'Material Approval', icon: 'ri-file-check-line', route: '/admin/materials' },
    { id: 'study-materials', name: 'Study Materials', icon: 'ri-folder-line', route: '/admin/study-materials' },
    { id: 'mentors', name: 'Mentor Approval', icon: 'ri-user-star-line', route: '/admin/mentors' },
    { id: 'feedback', name: 'Feedback Analytics', icon: 'ri-bar-chart-line', route: '/admin/feedback' },
    { id: 'notifications', name: 'Notifications', icon: 'ri-notification-2-line', route: '/admin/notifications' }
  ];

  // Determine active tab from path
  const activeTabId = tabs.find(tab => location.pathname.startsWith(tab.route))?.id || 'dashboard';

  useEffect(() => {
    // Redirect /admin to /admin/dashboard
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Floating Toggle Button - Bottom Left */}
      <button
        id="menu-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`
          fixed bottom-6 left-4 z-40
          flex items-center justify-center
          bg-blue-600 hover:bg-blue-700 text-white
          rounded-full shadow-lg
          h-12 w-12 md:hidden
          transition-all duration-300 ease-in-out
          transform hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <FiX className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <FiMenu className="h-6 w-6 transition-transform duration-300" />
        )}
      </button>
      
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`
            fixed md:static inset-y-0 left-0 z-30
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            transition-transform duration-300 ease-in-out
            w-64 bg-white shadow-lg flex-shrink-0
            h-screen flex flex-col
            ${isSidebarOpen ? 'shadow-xl' : 'shadow-none'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 flex flex-col h-0">
              <div className="p-2 space-y-1 overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.route)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap ${
                      activeTabId === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={`${tab.icon} text-lg`}></i>
                    </div>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </nav>
            
            {/* Fixed Bottom Section */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center mb-4 p-2 rounded-lg bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          <main className="flex-1 p-6">
            <Routes>
              <Route path="dashboard" element={<AdminOverview user={user} />} />
              <Route path="users" element={<UserManagement user={user} />} />
              <Route path="announcements" element={<AnnouncementSystem user={user} />} />
              <Route path="meetings" element={<MeetingOversight user={user} />} />
              <Route path="materials" element={<MaterialApproval user={user} />} />
              <Route path="study-materials" element={<StudyMaterialUpload user={user} />} />
              <Route path="mentors" element={<MentorApproval user={user} />} />
              <Route path="feedback" element={<FeedbackAnalytics user={user} />} />
              <Route path="notifications" element={<NotificationComposer user={user} />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}