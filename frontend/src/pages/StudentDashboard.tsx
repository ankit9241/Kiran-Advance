'use client';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../App';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '../components/Footer';
import DashboardOverview from '../components/student/DashboardOverview';
import ProfileManagement from '../components/student/ProfileManagement';
import MentorDirectory from '../components/student/MentorDirectory';
import StudyMaterials from '../components/student/StudyMaterials';
import ResourceLibrary from '../components/student/ResourceLibrary';
import DoubtSection from '../components/student/DoubtSection';
import MeetingInterface from '../components/student/MeetingInterface';
import FeedbackSystem from '../components/student/FeedbackSystem';

interface TabType {
  id: string;
  name: string;
  icon: string;
  route: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  phone?: string;
  studentId?: string;
  stream?: string;
  studentClass?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  bloodGroup?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  emergencyContact?: {
    name?: string;
    relation?: string;
    phone?: string;
  };
  bio?: string;
  preferredSubjects?: string[];
  learningGoals?: string;
  targetExam?: string;
  profilePicture?: string;
  isApproved?: boolean;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function StudentDashboard({ user: propUser, onLogout }: StudentDashboardProps) {
  const { user: authUser } = useAuth();
  
  // Merge prop user with auth user, with auth user taking precedence
  const user = {
    ...propUser,
    ...authUser,
    // Ensure nested objects are properly merged
    address: {
      ...propUser?.address,
      ...authUser?.address
    },
    emergencyContact: {
      ...propUser?.emergencyContact,
      ...authUser?.emergencyContact
    }
  };
  
  console.log('StudentDashboard rendering with user:', user);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Debug: Log when the component mounts
  useEffect(() => {
    console.log('StudentDashboard mounted');
    return () => {
      console.log('StudentDashboard unmounted');
    };
  }, []);

  // Define tabs for navigation - using relative paths for navigation
  const tabs: TabType[] = [
    { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line', route: '/student/dashboard' },
    { id: 'profile', name: 'Profile', icon: 'ri-user-line', route: '/student/profile' },
    { id: 'mentors', name: 'Mentors', icon: 'ri-user-star-line', route: '/student/mentors' },
    { id: 'materials', name: 'Study Materials', icon: 'ri-book-line', route: '/student/materials' },
    { id: 'resources', name: 'My Resources', icon: 'ri-folder-line', route: '/student/resources' },
    { id: 'doubts', name: 'Doubts', icon: 'ri-question-line', route: '/student/doubts' },
    { id: 'meetings', name: 'Meetings', icon: 'ri-calendar-line', route: '/student/meetings' },
    { id: 'feedback', name: 'Feedback', icon: 'ri-feedback-line', route: '/student/feedback' }
  ];

  // Determine active tab from path
  const activeTab = tabs.find(tab => location.pathname === tab.route)?.id || 'dashboard';

  // Handle initial redirect only once when component mounts
  useEffect(() => {
    // Only redirect if we're at the root of the student section
    if (location.pathname === '/student' || location.pathname === '/student/') {
      console.log('Redirecting to /student/dashboard');
      navigate('/student/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar user={user} onLogout={onLogout} />
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:pt-0 pt-16`}>
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Sidebar Navigation */}
            <div className="sidebar-navigation flex-1 p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(tab.route);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
              
              {/* Chat Button */}
              {/* Chat button removed as per user request */}
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 left-6 lg:hidden z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardOverview user={user} />} />
              <Route path="profile" element={<ProfileManagement user={user} />} />
              <Route path="mentors" element={<MentorDirectory user={user} />} />
              <Route path="materials" element={<StudyMaterials user={user} />} />
              <Route path="resources" element={<ResourceLibrary user={user} />} />
              <Route path="doubts" element={<DoubtSection user={user} />} />
              <Route path="meetings" element={<MeetingInterface user={user} />} />
              <Route path="feedback" element={<FeedbackSystem user={user} />} />
              {/* Chat routes removed as per user request */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}