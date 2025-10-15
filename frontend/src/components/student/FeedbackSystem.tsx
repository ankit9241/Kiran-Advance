'use client';

import { useState, useEffect } from 'react';

interface FeedbackSystemProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  openForm?: boolean;
}

type FeedbackType = 'mentor' | 'platform';

export default function FeedbackSystem({ user, openForm }: FeedbackSystemProps) {
  const [activeTab, setActiveTab] = useState('submit');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState<{
    type: FeedbackType;
    target: string;
    category: string;
    rating: number;
    title: string;
    description: string;
    suggestions: string;
    anonymous: boolean;
  }>({
    type: 'mentor',
    target: '',
    category: '',
    rating: 0,
    title: '',
    description: '',
    suggestions: '',
    anonymous: false
  });

  const submittedFeedback = [
    {
      id: 1,
      type: 'mentor',
      target: 'Dr. Sarah Wilson',
      category: 'Teaching Quality',
      rating: 5,
      title: 'Excellent Data Structures Session',
      description: 'Dr. Wilson explained complex algorithms in a very clear and understandable way. The examples were practical and relevant.',
      suggestions: 'Maybe include more hands-on coding exercises during the session.',
      submittedDate: '2024-03-10',
      status: 'reviewed',
      response: 'Thank you for the positive feedback! I\'ll definitely incorporate more coding exercises in future sessions.'
    },
    {
      id: 2,
      type: 'platform',
      target: 'KIRAN Platform',
      category: 'User Interface',
      rating: 4,
      title: 'Great platform with minor improvements needed',
      description: 'The platform is very user-friendly and intuitive. The notification system works well.',
      suggestions: 'The mobile version could be improved for better responsiveness.',
      submittedDate: '2024-03-08',
      status: 'pending',
      response: null
    },
    {
      id: 3,
      type: 'mentor',
      target: 'Prof. James Miller',
      category: 'Communication',
      rating: 4,
      title: 'Good React mentoring session',
      description: 'Professor Miller is very knowledgeable about React and provided helpful insights.',
      suggestions: 'Would appreciate more real-world project examples.',
      submittedDate: '2024-03-05',
      status: 'reviewed',
      response: 'Thanks for the feedback. I\'ll include more industry examples in upcoming sessions.'
    }
  ];

  const mentors = [
    'Dr. Sarah Wilson',
    'Prof. James Miller',
    'Dr. Emily Rodriguez',
    'Prof. Michael Chen'
  ];

  const categories = {
    mentor: ['Teaching Quality', 'Communication', 'Availability', 'Knowledge', 'Responsiveness'],
    platform: ['User Interface', 'Performance', 'Features', 'Notifications', 'Accessibility']
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeedback.target && newFeedback.category && newFeedback.rating && newFeedback.title && newFeedback.description) {
      console.log('Submitting feedback:', newFeedback);
      setShowFeedbackForm(false);
      setNewFeedback({
        type: 'mentor',
        target: '',
        category: '',
        rating: 0,
        title: '',
        description: '',
        suggestions: '',
        anonymous: false
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            <i className={`ri-star-${star <= rating ? 'fill' : 'line'}`}></i>
          </button>
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (openForm) setShowFeedbackForm(true);
  }, [openForm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Feedback System</h1>
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center space-x-2">
            <i className="ri-feedback-line"></i>
            <span>Submit Feedback</span>
          </div>
        </button>
      </div>

      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Submit Feedback</h2>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Feedback Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type"
                      value="mentor"
                      checked={newFeedback.type === 'mentor'}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value as FeedbackType, target: '', category: '' }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Mentor</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type"
                      value="platform"
                      checked={newFeedback.type === 'platform'}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value as FeedbackType, target: 'KIRAN Platform', category: '' }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Platform</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newFeedback.type === 'mentor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Mentor *
                    </label>
                    <div className="relative">
                      <select
                        value={newFeedback.target}
                        onChange={(e) => setNewFeedback(prev => ({ ...prev, target: e.target.value }))}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                        required
                      >
                        <option value="">Choose a mentor</option>
                        {mentors.map((mentor) => (
                          <option key={mentor} value={mentor}>{mentor}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-2.5 w-4 h-4 flex items-center justify-center pointer-events-none">
                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                      required
                    >
                      <option value="">Select category</option>
                      {categories[newFeedback.type].map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-2.5 w-4 h-4 flex items-center justify-center pointer-events-none">
                      <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-3">
                  {renderStars(newFeedback.rating, true, (rating) => 
                    setNewFeedback(prev => ({ ...prev, rating }))
                  )}
                  <span className="text-sm text-gray-600">
                    {newFeedback.rating > 0 ? `${newFeedback.rating} out of 5 stars` : 'Select a rating'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Title *
                </label>
                <input
                  type="text"
                  value={newFeedback.title}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter a brief title for your feedback"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback *
                </label>
                <textarea
                  value={newFeedback.description}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Share your detailed feedback, what went well, areas for improvement..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{newFeedback.description.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions for Improvement (Optional)
                </label>
                <textarea
                  value={newFeedback.suggestions}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Any specific suggestions or recommendations..."
                />
                <p className="text-xs text-gray-500 mt-1">{newFeedback.suggestions.length}/500 characters</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newFeedback.anonymous}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded text-blue-600"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Submit as anonymous feedback
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Submit Feedback
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
              { id: 'submit', name: 'Submit New' },
              { id: 'history', name: 'My Feedback', count: submittedFeedback.length }
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
                {tab.name} {tab.count && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'submit' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Why Your Feedback Matters</h2>
                <p className="text-blue-700 mb-4">
                  Your feedback helps us improve the quality of mentorship and platform experience. 
                  We value your honest opinions and suggestions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <i className="ri-user-heart-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800">Mentor Feedback</h3>
                      <p className="text-sm text-blue-600">Help mentors improve their teaching approach</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <i className="ri-computer-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-800">Platform Feedback</h3>
                      <p className="text-sm text-blue-600">Help us enhance features and user experience</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Quick Mentor Feedback</h3>
                  <p className="text-sm text-green-700 mb-3">Rate your recent mentors quickly</p>
                  <div className="space-y-3">
                    {mentors.slice(0, 2).map((mentor) => (
                      <div key={mentor} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="text-sm font-medium text-gray-800">{mentor}</span>
                        <button className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                          Rate Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Platform Suggestions</h3>
                  <p className="text-sm text-purple-700 mb-3">Help us improve your experience</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-purple-700">
                      <i className="ri-checkbox-circle-line"></i>
                      <span>User Interface</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-700">
                      <i className="ri-checkbox-circle-line"></i>
                      <span>Mobile App Features</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-700">
                      <i className="ri-checkbox-circle-line"></i>
                      <span>Notification System</span>
                    </div>
                  </div>
                  <button className="mt-3 text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                    Give Feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {submittedFeedback.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{feedback.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {feedback.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm text-gray-600">To: <strong>{feedback.target}</strong></span>
                        <span className="text-sm text-gray-600">Category: <strong>{feedback.category}</strong></span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Rating:</span>
                          {renderStars(feedback.rating)}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-2">{feedback.description}</p>
                      
                      {feedback.suggestions && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <h4 className="font-medium text-blue-800 mb-1">Suggestions:</h4>
                          <p className="text-sm text-blue-700">{feedback.suggestions}</p>
                        </div>
                      )}

                      {feedback.response && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">Response:</h4>
                          <p className="text-sm text-green-700">{feedback.response}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                        <span>Submitted on {new Date(feedback.submittedDate).toLocaleDateString()}</span>
                        {feedback.status === 'pending' && (
                          <span className="text-orange-600">Awaiting review</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {submittedFeedback.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-feedback-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No feedback submitted yet</h3>
                  <p className="text-gray-600 mb-4">Start by sharing your thoughts about mentors or the platform.</p>
                  <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Submit Your First Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}