'use client';

import { useState } from 'react';

interface UserManagementProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function UserManagement({ user }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const users = [
    {
      id: '1',
      name: 'Emma Watson',
      email: 'emma@student.edu',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2 hours ago',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20young%20woman%20student%20with%20books%20and%20laptop%20in%20modern%20university%20setting%2C%20bright%20natural%20lighting%2C%20educational%20environment&width=100&height=100&seq=student1&orientation=squarish'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@mentor.edu',
      role: 'mentor',
      status: 'active',
      joinDate: '2023-12-10',
      lastLogin: '1 hour ago',
      specialization: 'Computer Science',
      students: 12,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20with%20glasses%20in%20modern%20classroom%20setting%2C%20warm%20lighting%2C%20educational%20professional%20environment&width=100&height=100&seq=mentor1&orientation=squarish'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@student.edu',
      role: 'student',
      status: 'inactive',
      joinDate: '2024-01-20',
      lastLogin: '1 week ago',
      avatar: 'https://readdy.ai/api/search-image?query=young%20male%20student%20with%20backpack%20and%20notebook%20in%20university%20campus%20setting%2C%20natural%20daylight%2C%20educational%20atmosphere&width=100&height=100&seq=student2&orientation=squarish'
    },
    {
      id: '4',
      name: 'Prof. David Wilson',
      email: 'david@mentor.edu',
      role: 'mentor',
      status: 'pending',
      joinDate: '2024-01-25',
      lastLogin: 'Never',
      specialization: 'Mathematics',
      students: 0,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20male%20professor%20with%20beard%20in%20academic%20office%20setting%2C%20scholarly%20books%20background%2C%20warm%20professional%20lighting&width=100&height=100&seq=mentor2&orientation=squarish'
    }
  ];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || u.role === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage students, mentors and their access</p>
        </div>
        <button 
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['all', 'student', 'mentor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'all' && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{users.length}</span>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${
                        u.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {u.role}
                      </span>
                      {u.role === 'mentor' && u.specialization && (
                        <span className="text-xs text-gray-500 mt-1">{u.specialization}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {u.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 cursor-pointer">
                      Suspend
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
              <button 
                onClick={() => setShowAddUser(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 