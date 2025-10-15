'use client';

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import NotificationDropdown from './NotificationDropdown';

export interface PublicNavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
  onLogout?: () => void;
  notificationCount?: number;
}

export default function PublicNavbar(props: PublicNavbarProps) {
  const { user, onLogout, notificationCount = 0 } = props;
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesSidebar, setShowMessagesSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/support', label: 'Support' },
    { to: '/contact', label: 'Contact' },
    
    
  ];
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.jpg" alt="KIRAN Logo" className="h-10 w-10 object-contain rounded-md mr-2" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-pacifico"><b>KIRAN</b></span>
          {user && (
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize hidden sm:inline-block">
              {user.role}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-6">
          {/* Nav links and messages only on sm+ */}
          <div className="hidden sm:flex items-center space-x-2">
            {navLinks.map(link => {
              if (link.label === 'Home') {
                // Home link logic: logged in goes to /{role}/dashboard, else to /
                const dashboardPath = user ? `/${user.role}/dashboard` : '/';
                const isActive = user
                  ? location.pathname.startsWith(`/${user.role}/dashboard`)
                  : location.pathname === '/';
                return (
                  <NavLink
                    key={link.to}
                    to={dashboardPath}
                    end={!user}
                    className={({ isActive: navIsActive }) =>
                      `text-gray-700 font-medium transition-colors rounded px-3 py-2 hover:text-blue-600 hover:bg-blue-50${isActive ? ' bg-blue-100 text-blue-700 font-bold shadow' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              }
              // Other links
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-gray-700 font-medium transition-colors rounded px-3 py-2 hover:text-blue-600 hover:bg-blue-50${isActive ? ' bg-blue-100 text-blue-700 font-bold shadow' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>
          
          {/* Add NotificationDropdown before user menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-blue-600"></i>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </button>
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => { setShowUserMenu(false); navigate(`/student/profile`); }}
                      >
                        <i className="ri-user-line mr-3"></i>
                        Profile Settings
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => { setShowUserMenu(false); navigate('/preferences'); }}
                      >
                        <i className="ri-settings-line mr-3"></i>
                        Preferences
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => { setShowUserMenu(false); navigate('/help-support'); }}
                      >
                        <i className="ri-question-line mr-3"></i>
                        Help & Support
                      </button>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <i className="ri-logout-line mr-3"></i>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowRegisterMenu(!showRegisterMenu)}
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>Register</span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                {showRegisterMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <NavLink
                        to="/register/student"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowRegisterMenu(false)}
                      >
                        <i className="ri-user-line mr-3"></i>
                        As Student
                      </NavLink>
                      <NavLink
                        to="/register/mentor"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowRegisterMenu(false)}
                      >
                        <i className="ri-team-line mr-3"></i>
                        As Mentor
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-200 text-base"
              >
                Sign In
              </button>
              {showLogin && (
                <LoginForm onClose={() => setShowLogin(false)} />
              )}
            </div>
          )}
        </div>
      </div>
      {/* Click outside to close dropdowns */}
      {(showUserMenu || showRegisterMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowUserMenu(false);
            setShowRegisterMenu(false);
          }}
        />
      )}
    </nav>
  );
}

