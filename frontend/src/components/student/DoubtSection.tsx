'use client';

import { useState, useEffect } from 'react';

interface DoubtSectionProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  openForm?: boolean;
}

export default function DoubtSection({ user, openForm }: DoubtSectionProps) {
  const [activeTab, setActiveTab] = useState('my-doubts');
  const [showNewDoubtForm, setShowNewDoubtForm] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    tags: [] as string[]
  });

  useEffect(() => {
    if (openForm) setShowNewDoubtForm(true);
  }, [openForm]);

  const doubts = [
    {
      id: 1,
      title: 'Understanding Binary Search Tree Traversal',
      description: 'I\'m having trouble understanding the difference between in-order, pre-order, and post-order traversal in binary search trees. Could you explain with examples?',
      category: 'Data Structures',
      priority: 'high',
      status: 'pending',
      tags: ['BST', 'Traversal', 'Algorithms'],
      askedDate: '2024-03-12',
      mentor: null,
      responses: 0,
      views: 23
    },
    {
      id: 2,
      title: 'React useEffect dependency array confusion',
      description: 'When should I include variables in the useEffect dependency array? I\'m getting infinite re-renders in some cases.',
      category: 'Web Development',
      priority: 'medium',
      status: 'answered',
      tags: ['React', 'Hooks', 'useEffect'],
      askedDate: '2024-03-10',
      mentor: 'Prof. James Miller',
      responses: 3,
      views: 45,
      lastResponse: '2024-03-11'
    },
    {
      id: 3,
      title: 'SQL JOIN types and performance',
      description: 'What\'s the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN? Which one should I use for better performance?',
      category: 'Database',
      priority: 'medium',
      status: 'resolved',
      tags: ['SQL', 'JOIN', 'Performance'],
      askedDate: '2024-03-08',
      mentor: 'Dr. Sarah Wilson',
      responses: 2,
      views: 67,
      lastResponse: '2024-03-09',
      resolvedDate: '2024-03-09'
    },
    {
      id: 4,
      title: 'Machine Learning model overfitting',
      description: 'My neural network model is performing very well on training data but poorly on validation data. How can I prevent overfitting?',
      category: 'Machine Learning',
      priority: 'high',
      status: 'in-progress',
      tags: ['Neural Networks', 'Overfitting', 'Validation'],
      askedDate: '2024-03-07',
      mentor: 'Dr. Emily Rodriguez',
      responses: 5,
      views: 89,
      lastResponse: '2024-03-11'
    }
  ];

  const categories = ['Data Structures', 'Web Development', 'Database', 'Machine Learning', 'Algorithms', 'System Design'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'answered':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDoubt.title.trim() && newDoubt.description.trim() && newDoubt.category) {
      // Here you would typically submit to your backend
      console.log('Submitting doubt:', newDoubt);
      setShowNewDoubtForm(false);
      setNewDoubt({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        tags: []
      });
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newDoubt.tags.includes(tag.trim())) {
      setNewDoubt(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewDoubt(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Doubt Section</h1>
        <button
          onClick={() => setShowNewDoubtForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center space-x-2">
            <i className="ri-add-line"></i>
            <span>Ask Doubt</span>
          </div>
        </button>
      </div>

      {showNewDoubtForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Ask a New Doubt</h2>
                <button
                  onClick={() => setShowNewDoubtForm(false)}
                  className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitDoubt} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doubt Title *
                </label>
                <input
                  type="text"
                  value={newDoubt.title}
                  onChange={(e) => setNewDoubt(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter a clear, descriptive title for your doubt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <select
                    value={newDoubt.category}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-2.5 w-4 h-4 flex items-center justify-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex space-x-4">
                  {['low', 'medium', 'high'].map((priority) => (
                    <label key={priority} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={newDoubt.priority === priority}
                        onChange={(e) => setNewDoubt(prev => ({ ...prev, priority: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span className={`text-sm font-medium ${getPriorityColor(priority)}`}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Describe your doubt in detail. Include any code snippets, error messages, or specific scenarios you're facing."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{newDoubt.description.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newDoubt.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="w-4 h-4 hover:text-red-600 cursor-pointer"
                      >
                        <i className="ri-close-line text-xs"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewDoubtForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Submit Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'my-doubts', name: 'My Doubts', count: doubts.length },
              { id: 'pending', name: 'Pending', count: doubts.filter(d => d.status === 'pending').length },
              { id: 'answered', name: 'Answered', count: doubts.filter(d => d.status === 'answered').length },
              { id: 'resolved', name: 'Resolved', count: doubts.filter(d => d.status === 'resolved').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        <div className="p-6">
          <div className="space-y-4">
            {doubts
              .filter(doubt => {
                if (activeTab === 'my-doubts') return true;
                return doubt.status === activeTab;
              })
              .map((doubt) => (
                <div key={doubt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{doubt.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doubt.status)}`}>
                          {doubt.status.replace('-', ' ')}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(doubt.priority).replace('text-', 'bg-')}`}></div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{doubt.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doubt.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <i className="ri-calendar-line"></i>
                          <span>Asked {new Date(doubt.askedDate).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-eye-line"></i>
                          <span>{doubt.views} views</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-chat-3-line"></i>
                          <span>{doubt.responses} responses</span>
                        </span>
                        {doubt.mentor && (
                          <span className="flex items-center space-x-1">
                            <i className="ri-user-line"></i>
                            <span>Assigned to {doubt.mentor}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap">
                        View Details
                      </button>
                      {doubt.status === 'answered' && (
                        <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium cursor-pointer whitespace-nowrap">
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  {doubt.lastResponse && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <i className="ri-chat-3-line mr-1"></i>
                        Last response on {new Date(doubt.lastResponse).toLocaleDateString()}
                        {doubt.resolvedDate && (
                          <span className="ml-2 text-green-700">
                            • Resolved on {new Date(doubt.resolvedDate).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {doubts.filter(doubt => {
            if (activeTab === 'my-doubts') return true;
            return doubt.status === activeTab;
          }).length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-question-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No doubts found</h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'my-doubts' 
                  ? "You haven't asked any doubts yet." 
                  : `No doubts with ${activeTab} status.`}
              </p>
              <button
                onClick={() => setShowNewDoubtForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Ask Your First Doubt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}