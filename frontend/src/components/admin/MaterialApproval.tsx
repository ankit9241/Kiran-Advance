'use client';

import { useState } from 'react';

interface MaterialApprovalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function MaterialApproval({ user }: MaterialApprovalProps) {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  const materials = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      mentor: 'Dr. Sarah Johnson',
      subject: 'Web Development',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-20',
      status: 'pending',
      description: 'Comprehensive guide covering advanced React patterns including HOCs, Render Props, and Custom Hooks.',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20with%20glasses%20in%20modern%20classroom%20setting%2C%20warm%20lighting%2C%20educational%20professional%20environment&width=40&height=40&seq=mentor1&orientation=squarish',
      tags: ['react', 'patterns', 'advanced', 'web-development']
    },
    {
      id: 2,
      title: 'Data Structures and Algorithms',
      mentor: 'Prof. David Wilson',
      subject: 'Computer Science',
      type: 'pdf',
      size: '5.1 MB',
      uploadDate: '2024-01-19',
      status: 'approved',
      description: 'Complete study material covering fundamental data structures and algorithmic concepts.',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20male%20professor%20with%20beard%20in%20academic%20office%20setting%2C%20scholarly%20books%20background%2C%20warm%20professional%20lighting&width=40&height=40&seq=mentor2&orientation=squarish',
      tags: ['algorithms', 'data-structures', 'computer-science']
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      mentor: 'Dr. Emily Carter',
      subject: 'Artificial Intelligence',
      type: 'pdf',
      size: '8.7 MB',
      uploadDate: '2024-01-18',
      status: 'rejected',
      description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20scientist%20with%20lab%20coat%20in%20modern%20laboratory%20setting%2C%20bright%20lighting%2C%20scientific%20environment&width=40&height=40&seq=mentor3&orientation=squarish',
      tags: ['machine-learning', 'ai', 'fundamentals'],
      rejectionReason: 'Content needs better organization and more practical examples'
    },
    {
      id: 4,
      title: 'Python for Data Science',
      mentor: 'Dr. Sarah Johnson',
      subject: 'Programming',
      type: 'pdf',
      size: '3.2 MB',
      uploadDate: '2024-01-17',
      status: 'pending',
      description: 'Practical guide to using Python for data analysis and visualization.',
      mentorAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20mentor%20teacher%20with%20glasses%20in%20modern%20classroom%20setting%2C%20warm%20lighting%2C%20educational%20professional%20environment&width=40&height=40&seq=mentor1&orientation=squarish',
      tags: ['python', 'data-science', 'programming']
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      pdf: 'ri-file-pdf-line',
      doc: 'ri-file-word-line',
      ppt: 'ri-file-ppt-line',
      video: 'ri-video-line',
      audio: 'ri-file-music-line'
    };
    return icons[type as keyof typeof icons] || 'ri-file-line';
  };

  const filteredMaterials = materials.filter(material => {
    if (activeTab === 'all') return true;
    return material.status === activeTab;
  });

  const stats = {
    total: materials.length,
    pending: materials.filter(m => m.status === 'pending').length,
    approved: materials.filter(m => m.status === 'approved').length,
    rejected: materials.filter(m => m.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Material Approval</h1>
          <p className="text-gray-600 mt-1">Review and approve study materials from mentors</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Materials</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-file-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
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
            <h2 className="text-lg font-semibold text-gray-800">Study Materials</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'all', name: 'All', count: stats.total },
                { id: 'pending', name: 'Pending', count: stats.pending },
                { id: 'approved', name: 'Approved', count: stats.approved },
                { id: 'rejected', name: 'Rejected', count: stats.rejected }
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <i className={`${getTypeIcon(material.type)} text-gray-600`}></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{material.title}</div>
                        <div className="text-sm text-gray-500">{material.size} • {material.type.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={material.mentorAvatar}
                        alt={material.mentor}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <span className="text-sm text-gray-900">{material.mentor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {material.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => setSelectedMaterial(material)}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Review
                    </button>
                    {material.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-700 cursor-pointer">
                          Approve
                        </button>
                        <button className="text-red-600 hover:text-red-700 cursor-pointer">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Material Review</h3>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <p className="text-gray-900">{selectedMaterial.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900">{selectedMaterial.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                  <p className="text-gray-900">{selectedMaterial.type.toUpperCase()} • {selectedMaterial.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                  <p className="text-gray-900">{selectedMaterial.uploadDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedMaterial.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {selectedMaterial.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                  <p className="text-red-600 bg-red-50 p-3 rounded-lg">{selectedMaterial.rejectionReason}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
                {selectedMaterial.status === 'pending' && (
                  <>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 