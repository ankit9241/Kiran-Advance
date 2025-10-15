'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface DoubtQueueProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
}

export default function DoubtQueue({ user }: DoubtQueueProps) {
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [response, setResponse] = useState('');

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const doubtId = params.get('doubtId');
    if (doubtId) setSelectedDoubt(doubtId);
  }, [location.search]);

  // Mock doubts data
  const doubts = [
    {
      id: uuidv4(),
      title: 'Understanding React Hooks',
      description: 'I am having trouble understanding how useEffect works with dependencies. Can you explain when it runs and how to use it properly?',
      student: { name: 'Alice Johnson', email: 'alice@example.com' },
      subject: 'React',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      tags: ['hooks', 'useEffect', 'dependencies'],
      responses: []
    },
    {
      id: uuidv4(),
      title: 'Array Methods in JavaScript',
      description: 'What is the difference between map(), filter(), and reduce()? When should I use each one?',
      student: { name: 'Bob Smith', email: 'bob@example.com' },
      subject: 'JavaScript',
      priority: 'medium',
      status: 'in-progress',
      createdAt: '2024-01-19T14:15:00Z',
      updatedAt: '2024-01-20T09:20:00Z',
      tags: ['arrays', 'methods', 'map', 'filter', 'reduce'],
      responses: [
        {
          id: uuidv4(),
          message: 'Great question! Let me explain each method:\n\nmap() - transforms each element and returns a new array\nfilter() - creates a new array with elements that pass a test\nreduce() - reduces the array to a single value',
          author: 'Dr. Sarah Wilson',
          createdAt: '2024-01-20T09:20:00Z'
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'CSS Grid vs Flexbox',
      description: 'I am confused when to use CSS Grid and when to use Flexbox. They seem to do similar things.',
      student: { name: 'Carol Davis', email: 'carol@example.com' },
      subject: 'CSS',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-18T16:45:00Z',
      updatedAt: '2024-01-19T11:30:00Z',
      tags: ['css', 'grid', 'flexbox', 'layout'],
      responses: [
        {
          id: uuidv4(),
          message: 'Good question! Here is a simple guideline:\n\nFlexbox is great for 1-dimensional layouts (rows or columns)\nGrid is perfect for 2-dimensional layouts (rows AND columns)\n\nUse Flexbox for navigation bars, card layouts, centering items\nUse Grid for complex page layouts, photo galleries, dashboards',
          author: 'Dr. Sarah Wilson',
          createdAt: '2024-01-19T11:30:00Z'
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Async/Await vs Promises',
      description: 'I understand Promises but I am struggling with async/await syntax. How do they relate to each other?',
      student: { name: 'David Wilson', email: 'david@example.com' },
      subject: 'JavaScript',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-20T08:00:00Z',
      tags: ['async', 'await', 'promises', 'javascript'],
      responses: []
    }
  ];

  const filteredDoubts = doubts.filter(doubt => {
    if (filterStatus !== 'all' && doubt.status !== filterStatus) return false;
    if (filterPriority !== 'all' && doubt.priority !== filterPriority) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (doubtId: string, newStatus: string) => {
    console.log(`Changing doubt ${doubtId} status to ${newStatus}`);
  };

  const handleSendResponse = () => {
    if (response.trim() && selectedDoubt) {
      console.log(`Sending response to doubt ${selectedDoubt}: ${response}`);
      setResponse('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doubt Queue</h1>
            <p className="text-gray-600 mt-1">Manage and respond to student questions</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doubts List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Doubts ({filteredDoubts.length})</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt.id}
                onClick={() => setSelectedDoubt(doubt.id)}
                className={`p-6 cursor-pointer transition-colors ${
                  selectedDoubt === doubt.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{doubt.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(doubt.priority)}`}>
                        {doubt.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doubt.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{doubt.student.name}</span>
                        <span className="text-sm text-gray-500">{doubt.subject}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`}>
                        {doubt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doubt.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doubt Details */}
        <div className="bg-white rounded-lg shadow-sm">
          {selectedDoubt ? (
            (() => {
              const doubt = doubts.find(d => d.id === selectedDoubt);
              if (!doubt) return null;
              
              return (
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{doubt.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          By {doubt.student.name} • {new Date(doubt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(doubt.priority)}`}>
                          {doubt.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doubt.status)}`}>
                          {doubt.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Question */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Question</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{doubt.description}</p>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {doubt.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Responses */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Responses ({doubt.responses.length})</h4>
                      {doubt.responses.length > 0 ? (
                        <div className="space-y-4">
                          {doubt.responses.map((response) => (
                            <div key={response.id} className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-blue-900">{response.author}</span>
                                <span className="text-sm text-blue-600">
                                  {new Date(response.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-blue-800 whitespace-pre-line">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No responses yet</p>
                      )}
                    </div>
                  </div>

                  {/* Response Input */}
                  <div className="p-6 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Write your response to help the student..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <select
                          onChange={(e) => handleStatusChange(doubt.id, e.target.value)}
                          value={doubt.status}
                          className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setResponse('')}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleSendResponse}
                          disabled={!response.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-send-plane-line mr-2"></i>
                          Send Response
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-question-answer-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Doubt</h3>
              <p className="text-gray-600">Choose a doubt from the queue to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}