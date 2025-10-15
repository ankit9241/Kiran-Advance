'use client';

import { useState } from 'react';

interface FeedbackAnalyticsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export default function FeedbackAnalytics({ user }: FeedbackAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const feedbackData = [
    {
      id: 1,
      type: 'mentor',
      rating: 4.8,
      comment: 'Dr. Johnson is an excellent mentor. Very patient and explains concepts clearly.',
      student: 'Emma Watson',
      mentor: 'Dr. Sarah Johnson',
      subject: 'Web Development',
      date: '2024-01-24',
      sentiment: 'positive',
      category: 'teaching_quality',
      tags: ['patient', 'clear_explanation', 'helpful']
    },
    {
      id: 2,
      type: 'platform',
      rating: 3.5,
      comment: 'The platform is good but sometimes has connectivity issues during video calls.',
      student: 'Michael Chen',
      date: '2024-01-23',
      sentiment: 'neutral',
      category: 'technical_issues',
      tags: ['connectivity', 'video_calls', 'stability']
    },
    {
      id: 3,
      type: 'mentor',
      rating: 5.0,
      comment: 'Amazing session! Prof. Wilson helped me understand algorithms much better.',
      student: 'Lisa Park',
      mentor: 'Prof. David Wilson',
      subject: 'Computer Science',
      date: '2024-01-22',
      sentiment: 'positive',
      category: 'teaching_quality',
      tags: ['excellent', 'understanding', 'algorithms']
    },
    {
      id: 4,
      type: 'platform',
      rating: 2.0,
      comment: 'Difficult to find study materials. The search function needs improvement.',
      student: 'James Rodriguez',
      date: '2024-01-21',
      sentiment: 'negative',
      category: 'usability',
      tags: ['search', 'materials', 'navigation']
    },
    {
      id: 5,
      type: 'mentor',
      rating: 4.5,
      comment: 'Great mentor but would prefer more practical examples in sessions.',
      student: 'Sarah Kim',
      mentor: 'Dr. Emily Carter',
      subject: 'Machine Learning',
      date: '2024-01-20',
      sentiment: 'positive',
      category: 'content_delivery',
      tags: ['practical_examples', 'improvement', 'content']
    }
  ];

  const stats = {
    totalFeedback: feedbackData.length,
    avgRating: (feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1),
    positiveCount: feedbackData.filter(f => f.sentiment === 'positive').length,
    neutralCount: feedbackData.filter(f => f.sentiment === 'neutral').length,
    negativeCount: feedbackData.filter(f => f.sentiment === 'negative').length
  };

  const categoryStats = [
    { name: 'Teaching Quality', count: 12, avg: 4.6, trend: '+0.3' },
    { name: 'Technical Issues', count: 8, avg: 3.2, trend: '-0.2' },
    { name: 'Content Delivery', count: 15, avg: 4.3, trend: '+0.1' },
    { name: 'Usability', count: 6, avg: 3.8, trend: '+0.5' },
    { name: 'Communication', count: 9, avg: 4.4, trend: '+0.2' }
  ];

  const getSentimentColor = (sentiment: string) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      negative: 'bg-red-100 text-red-800'
    };
    return colors[sentiment as keyof typeof colors] || colors.neutral;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${i < Math.floor(rating) ? 'fill' : i < rating ? 'half' : 'line'} text-yellow-400`}
      ></i>
    ));
  };

  const filteredFeedback = feedbackData.filter(feedback => {
    if (selectedCategory === 'all') return true;
    return feedback.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feedback Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze user feedback and platform satisfaction</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalFeedback}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-feedback-line text-xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-star-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positive</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.positiveCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-emotion-happy-line text-xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Neutral</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.neutralCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-emotion-normal-line text-xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negative</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.negativeCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-emotion-unhappy-line text-xl text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Feedback by Category</h2>
          </div>
          <div className="p-6 space-y-4">
            {categoryStats.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{category.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{category.avg}</span>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(category.avg)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.count} feedback entries</span>
                    <span className={`${category.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {category.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Sentiment Distribution</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Positive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.positiveCount / stats.totalFeedback) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{stats.positiveCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Neutral</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.neutralCount / stats.totalFeedback) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{stats.neutralCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Negative</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(stats.negativeCount / stats.totalFeedback) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{stats.negativeCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Feedback</h2>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              <option value="all">All Categories</option>
              <option value="teaching_quality">Teaching Quality</option>
              <option value="technical_issues">Technical Issues</option>
              <option value="content_delivery">Content Delivery</option>
              <option value="usability">Usability</option>
            </select>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {getRatingStars(feedback.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{feedback.rating}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {feedback.type}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{feedback.date}</span>
              </div>

              <p className="text-gray-800 mb-4 leading-relaxed">{feedback.comment}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>By: {feedback.student}</span>
                  {feedback.mentor && <span>Mentor: {feedback.mentor}</span>}
                  {feedback.subject && <span>Subject: {feedback.subject}</span>}
                </div>
                <div className="flex items-center space-x-2">
                  {feedback.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 