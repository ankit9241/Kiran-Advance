'use client';

import { useState } from 'react';

interface FeedbackViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'mentor' | 'admin';
    avatar?: string;
  };
}

export default function FeedbackView({ user }: FeedbackViewProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Mock feedback data
  const feedbacks = [
    {
      id: '1',
      student: { name: 'Alice Johnson', email: 'alice@example.com' },
      rating: 5,
      category: 'Teaching Quality',
      title: 'Excellent explanation of React concepts',
      message: 'Dr. Wilson explains complex React concepts in a very clear and understandable way. The hands-on examples really helped me grasp the concepts better. Thank you for your patience and detailed explanations!',
      date: '2024-01-20',
      status: 'public',
      helpful: 8,
      reply: null
    },
    {
      id: '2',
      student: { name: 'Bob Smith', email: 'bob@example.com' },
      rating: 4,
      category: 'Mentorship Support',
      title: 'Great mentor, very supportive',
      message: 'Always available to help with doubts and provides constructive feedback on assignments. Could improve on response time for urgent queries, but overall a great learning experience.',
      date: '2024-01-18',
      status: 'public',
      helpful: 5,
      reply: {
        message: 'Thank you for the feedback, Bob! I appreciate your patience and will work on improving my response time for urgent queries.',
        date: '2024-01-19'
      }
    },
    {
      id: '3',
      student: { name: 'Carol Davis', email: 'carol@example.com' },
      rating: 5,
      category: 'Course Content',
      title: 'Comprehensive and well-structured',
      message: 'The study materials and course structure are excellent. Every topic builds on the previous one logically. The practical exercises are particularly helpful in reinforcing the concepts.',
      date: '2024-01-15',
      status: 'public',
      helpful: 12,
      reply: null
    },
    {
      id: '4',
      student: { name: 'David Wilson', email: 'david@example.com' },
      rating: 3,
      category: 'Teaching Quality',
      title: 'Good but could be more engaging',
      message: 'The content is good and informative, but sometimes the sessions can be a bit monotonous. Would appreciate more interactive elements and real-world examples.',
      date: '2024-01-12',
      status: 'private',
      helpful: 3,
      reply: null
    },
    {
      id: '5',
      student: { name: 'Emma Brown', email: 'emma@example.com' },
      rating: 5,
      category: 'Overall Experience',
      title: 'Outstanding mentor experience',
      message: 'One of the best mentors I have worked with. Very knowledgeable, patient, and always willing to go the extra mile to help students succeed. Highly recommend!',
      date: '2024-01-10',
      status: 'public',
      helpful: 15,
      reply: {
        message: 'Thank you so much, Emma! It has been a pleasure working with you too. Your dedication and enthusiasm make teaching a joy!',
        date: '2024-01-11'
      }
    },
    {
      id: '6',
      student: { name: 'Frank Miller', email: 'frank@example.com' },
      rating: 2,
      category: 'Communication',
      title: 'Communication needs improvement',
      message: 'While the technical knowledge is there, communication could be clearer. Sometimes explanations are too technical and hard to follow for beginners.',
      date: '2024-01-08',
      status: 'private',
      helpful: 1,
      reply: null
    }
  ];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (filterRating === 'all') return true;
    return feedback.rating.toString() === filterRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    return status === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < rating ? 'fill' : 'line'} ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      ></i>
    ));
  };

  const handleReply = (feedbackId: string) => {
    setSelectedFeedback(feedbackId);
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    console.log(`Sending reply to feedback ${selectedFeedback}:`, replyText);
    setShowReplyModal(false);
    setReplyText('');
    setSelectedFeedback(null);
  };

  // Calculate statistics
  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const totalHelpful = feedbacks.reduce((sum, f) => sum + f.helpful, 0);
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Feedback</h1>
            <p className="text-gray-600 mt-1">View and respond to student feedback about your mentorship</p>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center space-x-1 mt-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Average Rating</p>
            <p className="text-xs text-gray-500">Based on {feedbacks.length} reviews</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{totalHelpful}</div>
            <p className="text-sm text-gray-600 mt-2">Total Helpful Votes</p>
            <p className="text-xs text-gray-500">Students found feedback helpful</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((feedbacks.filter(f => f.reply).length / feedbacks.length) * 100)}%
            </div>
            <p className="text-sm text-gray-600 mt-2">Response Rate</p>
            <p className="text-xs text-gray-500">Feedback with replies</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-16">
                <span className="text-sm text-gray-600">{item.rating}</span>
                <i className="ri-star-fill text-yellow-400 text-sm"></i>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Feedback ({filteredFeedbacks.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-xl text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feedback.student.name}</h4>
                    <p className="text-sm text-gray-600">{feedback.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex space-x-1">
                        {renderStars(feedback.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                  {!feedback.reply && (
                    <button
                      onClick={() => handleReply(feedback.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">{feedback.title}</h5>
                <p className="text-gray-700">{feedback.message}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <i className="ri-thumb-up-line"></i>
                    <span>{feedback.helpful} found this helpful</span>
                  </span>
                </div>
              </div>

              {feedback.reply && (
                <div className="bg-blue-50 rounded-lg p-4 ml-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-reply-line text-blue-600"></i>
                    <span className="font-medium text-blue-900">Your Reply</span>
                    <span className="text-sm text-blue-600">
                      {new Date(feedback.reply.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-blue-800">{feedback.reply.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Reply to Feedback</h2>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-close-line text-xl"></i>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6">
              {(() => {
                const feedback = feedbacks.find(f => f.id === selectedFeedback);
                if (!feedback) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{feedback.student.name}</span>
                        <div className="flex space-x-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">{feedback.title}</h5>
                      <p className="text-gray-700">{feedback.message}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Write your response to the student's feedback..."
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}