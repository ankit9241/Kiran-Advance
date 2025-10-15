'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiBook, 
  FiDollarSign, 
  FiPieChart, 
  FiMessageSquare,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

interface AdminSidebarProps {
  onLogout: () => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, isMobileOpen, onToggleMobile }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/mentors', icon: <FiUser />, label: 'Mentors' },
    { to: '/admin/courses', icon: <FiBook />, label: 'Courses' },
    { to: '/admin/payments', icon: <FiDollarSign />, label: 'Payments' },
    { to: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
    { to: '/admin/support', icon: <FiMessageSquare />, label: 'Support' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileOpen) {
      onToggleMobile();
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggleMobile}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-700 to-blue-800 text-white transition-all duration-300 ease-in-out z-30
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'w-20' : 'w-64'} 
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-blue-600">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <img 
                  src="/assets/logo.jpg" 
                  alt="KIRAN Logo" 
                  className="h-8 w-8 object-contain rounded-md"
                />
                <span className="text-xl font-bold text-white">KIRAN</span>
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(item.to)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-blue-100 hover:bg-blue-600 hover:bg-opacity-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-blue-600">
            <button
              onClick={onLogout}
              className={`flex items-center w-full p-3 rounded-lg text-blue-100 hover:bg-blue-600 transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <span className="text-xl"><FiLogOut /></span>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
