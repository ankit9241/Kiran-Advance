'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface StudyMaterialsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  openDownload?: boolean;
}

export default function StudyMaterials({ user, openDownload }: StudyMaterialsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openDownload && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openDownload]);

  const materials = [
    {
      id: uuidv4(),
      title: 'Data Structures and Algorithms - Complete Guide',
      description: 'Comprehensive guide covering arrays, linked lists, trees, graphs, and sorting algorithms with practical examples.',
      category: 'Computer Science',
      type: 'PDF',
      size: '15.2 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadDate: '2024-03-10',
      downloads: 245,
      tags: ['Data Structures', 'Algorithms', 'Programming'],
      thumbnail: 'https://readdy.ai/api/search-image?query=data%20structures%20and%20algorithms%20textbook%20cover%2C%20clean%20academic%20design%2C%20blue%20and%20white%20color%20scheme&width=200&height=250&seq=dsa-book&orientation=portrait'
    },
    {
      id: uuidv4(),
      title: 'JavaScript ES6+ Features and Best Practices',
      description: 'Modern JavaScript concepts including arrow functions, promises, async/await, and ES6+ syntax.',
      category: 'Web Development',
      type: 'PDF',
      size: '8.7 MB',
      uploadedBy: 'Prof. James Miller',
      uploadDate: '2024-03-08',
      downloads: 189,
      tags: ['JavaScript', 'ES6', 'Web Development'],
      thumbnail: 'https://readdy.ai/api/search-image?query=javascript%20programming%20book%20cover%2C%20modern%20web%20development%20design%2C%20yellow%20and%20black%20color%20scheme&width=200&height=250&seq=js-book&orientation=portrait'
    },
    {
      id: uuidv4(),
      title: 'Database Design Fundamentals',
      description: 'Complete guide to relational database design, normalization, SQL queries, and database optimization.',
      category: 'Database',
      type: 'PDF',
      size: '12.4 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadDate: '2024-03-05',
      downloads: 156,
      tags: ['Database', 'SQL', 'Design'],
      thumbnail: 'https://readdy.ai/api/search-image?query=database%20design%20textbook%20cover%2C%20professional%20academic%20style%2C%20green%20and%20white%20color%20scheme&width=200&height=250&seq=db-book&orientation=portrait'
    },
    {
      id: uuidv4(),
      title: 'React Components and Hooks - Video Series',
      description: 'Comprehensive video tutorial series covering React components, hooks, state management, and best practices.',
      category: 'Web Development',
      type: 'Video',
      size: '2.1 GB',
      uploadedBy: 'Prof. James Miller',
      uploadDate: '2024-03-03',
      downloads: 203,
      tags: ['React', 'Components', 'Hooks'],
      thumbnail: 'https://readdy.ai/api/search-image?query=react%20programming%20video%20tutorial%20thumbnail%2C%20modern%20web%20development%20design%2C%20blue%20and%20white%20interface&width=200&height=250&seq=react-video&orientation=portrait'
    },
    {
      id: uuidv4(),
      title: 'Machine Learning Practice Problems',
      description: 'Collection of hands-on machine learning exercises with solutions and detailed explanations.',
      category: 'Machine Learning',
      type: 'ZIP',
      size: '45.8 MB',
      uploadedBy: 'Dr. Emily Rodriguez',
      uploadDate: '2024-02-28',
      downloads: 134,
      tags: ['Machine Learning', 'Python', 'Practice'],
      thumbnail: 'https://readdy.ai/api/search-image?query=machine%20learning%20practice%20workbook%20cover%2C%20data%20science%20design%2C%20purple%20and%20white%20color%20scheme&width=200&height=250&seq=ml-practice&orientation=portrait'
    },
    {
      id: uuidv4(),
      title: 'System Design Interview Preparation',
      description: 'Essential system design concepts, patterns, and real-world examples for technical interviews.',
      category: 'Interview Prep',
      type: 'PDF',
      size: '18.9 MB',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadDate: '2024-02-25',
      downloads: 312,
      tags: ['System Design', 'Interview', 'Architecture'],
      thumbnail: 'https://readdy.ai/api/search-image?query=system%20design%20interview%20book%20cover%2C%20technical%20architecture%20design%2C%20orange%20and%20white%20color%20scheme&width=200&height=250&seq=system-design&orientation=portrait'
    }
  ];

  // Personal resources mock (should match ResourceLibrary)
  const personalResources = [
    {
      id: 'p1',
      title: 'Algebra Notes',
      type: 'PDF',
      size: '1.1 MB',
      url: '/resources/algebra-notes.pdf',
      uploadedAt: '2024-04-01',
      sender: 'Mentor John'
    },
    {
      id: 'p2',
      title: 'Physics Video',
      type: 'Video',
      size: '120 MB',
      url: 'https://youtube.com/watch?v=example',
      uploadedAt: '2024-04-02',
      sender: 'Admin Alice'
    }
  ];
  // Folder/subject resources mock (should match ResourceLibrary)
  const folderResources = [
    // Web Development Series
    { id: '1', title: 'HTML5 Complete Guide', type: 'PDF', size: '2.5 MB', url: '/resources/html5-guide.pdf', uploadedAt: '2024-03-01', sender: 'System' },
    { id: '2', title: 'CSS Grid Tutorial Video', type: 'Video', size: '150 MB', url: 'https://youtube.com/watch?v=example', uploadedAt: '2024-03-02', sender: 'System' },
    { id: '3', title: 'ES6+ Features Cheatsheet', type: 'PDF', size: '1.2 MB', url: '/resources/es6-cheatsheet.pdf', uploadedAt: '2024-03-03', sender: 'System' },
    { id: '4', title: 'JavaScript Practice Exercises', type: 'XLSX', size: '856 KB', url: '/resources/js-exercises.xlsx', uploadedAt: '2024-03-04', sender: 'System' },
    // Data Structures & Algorithms
    { id: '5', title: 'Array Algorithms Presentation', type: 'PPT', size: '4.8 MB', url: '/resources/array-algorithms.ppt', uploadedAt: '2024-02-15', sender: 'System' },
    { id: '6', title: 'Binary Tree Traversal Tutorial', type: 'Link', size: '-', url: 'https://example.com/binary-tree-tutorial', uploadedAt: '2024-02-20', sender: 'System' },
  ];
  // Combine all resources
  const allResources = [...personalResources, ...folderResources];

  const categories = ['all', 'Computer Science', 'Web Development', 'Database', 'Machine Learning', 'Interview Prep'];

  // For the new logic, show allResources as cards, filter by search/category if needed
  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    // No category filter for now, as not all resources have category
    return matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'ri-file-pdf-line';
      case 'video':
        return 'ri-video-line';
      case 'zip':
        return 'ri-file-zip-line';
      default:
        return 'ri-file-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'text-red-600 bg-red-50';
      case 'video':
        return 'text-purple-600 bg-purple-50';
      case 'zip':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Study Materials</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className="ri-grid-line"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className="ri-list-check"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials, tags, or descriptions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                ref={searchInputRef}
              />
              <div className="absolute left-3 top-2.5 w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredResources.length} of {allResources.length} resources
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <i className="ri-download-line"></i>
            {/* No total downloads for allResources, as not all have downloads */}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div key={res.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(res.type)}`}> 
                    <div className="flex items-center space-x-1">
                      <i className={`ri-file-${res.type.toLowerCase()}-line text-xs`}></i>
                      <span>{res.type}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{res.title}</h3>
                <div className="text-xs text-gray-500 space-y-1 mb-4">
                  <p>By {res.sender || 'System'}</p>
                  <p>{res.size}</p>
                  <p>Uploaded {res.uploadedAt}</p>
                </div>
                <a
                  href={res.url}
                  target={res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? '_blank' : undefined}
                  rel={res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  download={!(res.type.toLowerCase() === 'link' || res.url.startsWith('http'))}
                  className="w-full block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap text-center mt-2"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-download-line"></i>
                    <span>{res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? 'View' : 'Download'}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(res.type)}`}> 
                    <div className="flex items-center space-x-1">
                      <i className={`ri-file-${res.type.toLowerCase()}-line text-xs`}></i>
                      <span>{res.type}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{res.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By {res.sender || 'System'}</span>
                      <span>{res.size}</span>
                      <span>Uploaded {res.uploadedAt}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={res.url}
                  target={res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? '_blank' : undefined}
                  rel={res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  download={!(res.type.toLowerCase() === 'link' || res.url.startsWith('http'))}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap text-center"
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-download-line"></i>
                    <span>{res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? 'View' : 'Download'}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-file-list-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}