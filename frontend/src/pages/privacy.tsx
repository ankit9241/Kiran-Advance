import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 text-center">Privacy Policy</h1>
      <p className="text-gray-700 text-lg mb-6">We value your privacy. This policy explains how we collect, use, and protect your information.</p>
      <h2 className="text-xl font-bold text-blue-700 mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Personal details (name, email, etc.) provided during registration</li>
        <li>Usage data (pages visited, resources accessed)</li>
        <li>Any information you submit via forms (doubts, feedback, contact, etc.)</li>
      </ul>
      <h2 className="text-xl font-bold text-blue-700 mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>To provide and improve our services</li>
        <li>To communicate with you about your account or support requests</li>
        <li>To ensure platform security and integrity</li>
      </ul>
      <h2 className="text-xl font-bold text-blue-700 mt-8 mb-2">How We Protect Your Data</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>We use secure servers and encryption</li>
        <li>We do not sell your data to third parties</li>
        <li>Access to your data is restricted to authorized personnel only</li>
      </ul>
      <h2 className="text-xl font-bold text-blue-700 mt-8 mb-2">Your Rights</h2>
      <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>You can request to view, update, or delete your data at any time</li>
        <li>Contact us at <a href="mailto:adityasinghofficial296@gmail.com" className="text-blue-600 hover:underline">adityasinghofficial296@gmail.com</a> for privacy concerns</li>
      </ul>
      <p className="text-gray-600 mt-8">By using our platform, you agree to this Privacy Policy.</p>
    </div>
  </div>
);

export default PrivacyPolicy; 