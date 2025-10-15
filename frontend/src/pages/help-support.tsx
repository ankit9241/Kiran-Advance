import React from 'react';
import { Link } from 'react-router-dom';

const helpTopics = [
  {
    title: 'Account Issues',
    description: 'Problems with login, registration, or account settings.'
  },
  {
    title: 'Resource Access',
    description: 'Trouble accessing study materials or personal resources.'
  },
  {
    title: 'Mentor Communication',
    description: 'Difficulties contacting or receiving responses from mentors.'
  },
  {
    title: 'Technical Support',
    description: 'Report bugs, errors, or technical issues.'
  }
];

const HelpSupport = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-6 text-center">Help & Support</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Find answers to common questions, get in touch with our team, or explore support resources below.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Link to="/faq" className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-100 transition text-center">FAQ</Link>
        <Link to="/contact" className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-100 transition text-center">Contact Us</Link>
        <Link to="/support" className="bg-blue-50 text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-100 transition text-center">Support Center</Link>
      </div>
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-4">Common Help Topics</h2>
        <ul className="space-y-4">
          {helpTopics.map((topic, idx) => (
            <li key={idx} className="p-4 rounded-lg bg-blue-50 text-blue-800 font-medium shadow-sm">
              <span className="block text-lg font-semibold mb-1">{topic.title}</span>
              <span className="block text-base text-blue-900">{topic.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default HelpSupport; 