'use client';

import { useState } from 'react';

interface ResourceLibraryProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function ResourceLibrary({ user }: ResourceLibraryProps) {
  const [activeTab, setActiveTab] = useState('my-folders');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Mock data for folders (read-only for students)
  const [folders] = useState<{
    id: string;
    name: string;
    description: string;
    privacy: string;
    createdAt: string;
    subjects: Array<{
      id: string;
      name: string;
      resources: Array<{
        id: string;
        title: string;
        type: string;
        size?: string;
        url: string;
        privacy: string;
        uploadedAt: string;
      }>;
    }>;
  }[]>([
    {
      id: '1',
      name: 'Web Development Series',
      description: 'Complete web development learning path from basics to advanced',
      privacy: 'public',
      createdAt: '2024-03-01',
      subjects: [
        {
          id: '1',
          name: 'HTML & CSS Fundamentals',
          resources: [
            {
              id: '1',
              title: 'HTML5 Complete Guide',
              type: 'PDF',
              size: '2.5 MB',
              url: '/resources/html5-guide.pdf',
              privacy: 'public',
              uploadedAt: '2024-03-01'
            },
            {
              id: '2',
              title: 'CSS Grid Tutorial Video',
              type: 'Video',
              size: '150 MB',
              url: 'https://youtube.com/watch?v=example',
              privacy: 'public',
              uploadedAt: '2024-03-02'
            }
          ]
        },
        {
          id: '2',
          name: 'JavaScript Essentials',
          resources: [
            {
              id: '3',
              title: 'ES6+ Features Cheatsheet',
              type: 'PDF',
              size: '1.2 MB',
              url: '/resources/es6-cheatsheet.pdf',
              privacy: 'public',
              uploadedAt: '2024-03-03'
            },
            {
              id: '4',
              title: 'JavaScript Practice Exercises',
              type: 'XLSX',
              size: '856 KB',
              url: '/resources/js-exercises.xlsx',
              privacy: 'private',
              uploadedAt: '2024-03-04'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Data Structures & Algorithms',
      description: 'Comprehensive DSA study materials and practice problems',
      privacy: 'private',
      createdAt: '2024-02-15',
      subjects: [
        {
          id: '3',
          name: 'Arrays and Strings',
          resources: [
            {
              id: '5',
              title: 'Array Algorithms Presentation',
              type: 'PPT',
              size: '4.8 MB',
              url: '/resources/array-algorithms.ppt',
              privacy: 'private',
              uploadedAt: '2024-02-15'
            }
          ]
        },
        {
          id: '4',
          name: 'Trees and Graphs',
          resources: [
            {
              id: '6',
              title: 'Binary Tree Traversal Tutorial',
              type: 'Link',
              url: 'https://example.com/binary-tree-tutorial',
              privacy: 'private',
              uploadedAt: '2024-02-20'
            }
          ]
        }
      ]
    }
  ]);

  // --- Personal Resources (mock, would come from backend) ---
  const [personalResources] = useState([
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
  ]);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'ri-file-pdf-line';
      case 'ppt': return 'ri-file-ppt-line';
      case 'xlsx': return 'ri-file-excel-line';
      case 'video': return 'ri-video-line';
      case 'link': return 'ri-external-link-line';
      default: return 'ri-file-line';
    }
  };

  const getResourceColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'text-red-600 bg-red-50';
      case 'ppt': return 'text-orange-600 bg-orange-50';
      case 'xlsx': return 'text-green-600 bg-green-50';
      case 'video': return 'text-purple-600 bg-purple-50';
      case 'link': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resource Library</h1>
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'my-folders', name: 'Study Materials', count: folders.length },
              { id: 'personal-resources', name: 'Personal Resources', count: personalResources.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedFolder(null);
                  setSelectedSubject(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
        <div className="p-0 md:p-6">
          {/* Study Materials Tab (Folders/Subjects/Resources) */}
          {activeTab === 'my-folders' && (
            <div className="flex flex-col md:flex-row gap-0 md:gap-8">
              {/* Sidebar: Folders & Subjects Accordion */}
              <aside className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-4 md:p-0 md:py-4 md:pl-4 md:pr-0 min-h-[400px]">
                <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <i className="ri-folder-line"></i>Folders
                </h2>
                <ul className="space-y-1">
                  {folders.map(folder => (
                    <li key={folder.id}>
                      <div>
                        <button
                          className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-left ${selectedFolder === folder.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 text-gray-700'}`}
                          onClick={() => {
                            setSelectedFolder(folder.id === selectedFolder ? null : folder.id);
                            setSelectedSubject(null);
                          }}
                        >
                          <i className="ri-folder-2-line mr-2 text-lg"></i>
                          <span className="flex-1">{folder.name}</span>
                          <i className={`ri-arrow-${selectedFolder === folder.id ? 'down' : 'right'}-s-line ml-2 text-gray-400`}></i>
                        </button>
                        {/* Subjects Accordion */}
                        {selectedFolder === folder.id && (
                          <ul className="pl-6 mt-1 space-y-1 border-l-2 border-blue-100">
                            {folder.subjects.map(subject => (
                              <li key={subject.id}>
                                <button
                                  className={`w-full flex items-center px-3 py-1.5 rounded-lg transition-colors text-left text-sm ${selectedSubject === subject.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-blue-50 text-gray-700'}`}
                                  onClick={() => setSelectedSubject(subject.id)}
                                >
                                  <i className="ri-book-open-line mr-2 text-base"></i>
                                  {subject.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
              {/* Main Panel: Resources */}
              <main className="flex-1 p-4 md:p-0">
                <div className="border-b border-gray-200 mb-6 pb-2 flex items-center gap-2">
                  <i className="ri-file-list-2-line text-blue-400 text-xl"></i>
                  <span className="text-lg font-semibold text-blue-800">Resources</span>
                </div>
                {selectedFolder && selectedSubject ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow text-sm">
                      <thead>
                        <tr className="text-blue-700">
                          <th className="py-2 px-4 text-left">Title</th>
                          <th className="py-2 px-4 text-left">Type</th>
                          <th className="py-2 px-4 text-left">Size</th>
                          <th className="py-2 px-4 text-left">Date</th>
                          <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {folders.find(f => f.id === selectedFolder)?.subjects.find(s => s.id === selectedSubject)?.resources.map(res => (
                          <tr key={res.id} className="hover:bg-blue-50 transition-all">
                            <td className="py-2 px-4 font-medium text-blue-900 flex items-center gap-2">
                              <i className={`${getResourceIcon(res.type)} text-lg`}></i>
                              {res.title}
                            </td>
                            <td className="py-2 px-4">{res.type}</td>
                            <td className="py-2 px-4">{res.size || '-'}</td>
                            <td className="py-2 px-4">{res.uploadedAt}</td>
                            <td className="py-2 px-4">
                              {res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 transition-all"
                                >
                                  View
                                </a>
                              ) : (
                                <a
                                  href={res.url}
                                  download
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 transition-all"
                                >
                                  Download
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <i className="ri-arrow-left-line text-3xl mb-2"></i>
                    <div className="text-base">Select a folder and subject to view resources.</div>
                  </div>
                )}
              </main>
            </div>
          )}
          {/* Personal Resources Tab */}
          {activeTab === 'personal-resources' && (
            <div>
              {personalResources.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <i className="ri-inbox-line text-4xl mb-2"></i>
                  <div>No personal resources have been shared with you yet.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow text-sm">
                    <thead>
                      <tr className="text-blue-700">
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Type</th>
                        <th className="py-2 px-4 text-left">Size</th>
                        <th className="py-2 px-4 text-left">Sender</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personalResources.map((res) => (
                        <tr key={res.id} className="hover:bg-blue-50 transition-all">
                          <td className="py-2 px-4 font-medium text-blue-900 flex items-center gap-2">
                            <i className={`${getResourceIcon(res.type)} text-lg`}></i>
                            {res.title}
                          </td>
                          <td className="py-2 px-4">{res.type}</td>
                          <td className="py-2 px-4">{res.size}</td>
                          <td className="py-2 px-4">{res.sender}</td>
                          <td className="py-2 px-4">{res.uploadedAt}</td>
                          <td className="py-2 px-4">
                            {res.type.toLowerCase() === 'link' || res.url.startsWith('http') ? (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 transition-all"
                              >
                                View
                              </a>
                            ) : (
                              <a
                                href={res.url}
                                download
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium hover:bg-blue-200 transition-all"
                              >
                                Download
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}