import React from 'react';

const AboutUs = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 text-center">About Us</h1>
      <p className="text-gray-700 text-lg mb-6">
        <span className="font-semibold">Our Mission:</span> To empower students and mentors with a collaborative, resource-rich platform for personalized learning and growth.
      </p>
      <p className="text-gray-700 text-lg mb-8">
        <span className="font-semibold">Our Vision:</span> To make quality education accessible, interactive, and engaging for everyone, everywhere.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">Meet the Team</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><span className="font-semibold">Aditya Singh</span> – Founder & Organiser (manages and leads the KIRAN mentorship program)</li>
          <li><span className="font-semibold">Ankit Kumar</span> – Tech Support Lead (developed and maintains the website, handles all technical support)</li>
          <li><span className="font-semibold">KIRAN Team</span> – Mentors, Admins, and Contributors</li>
        </ul>
      </div>
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-blue-600 mb-3">Contact</h2>
        <div className="space-y-1 text-gray-700">
          <p><span className="font-semibold">Email:</span> <a href="mailto:adityasinghofficial296@gmail.com" className="text-blue-600 hover:underline">adityasinghofficial296@gmail.com</a></p>
          <p><span className="font-semibold">Telegram:</span> <a href="https://t.me/Aditya22906" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@Aditya22906</a></p>
          <p><span className="font-semibold">Instagram:</span> <a href="https://www.instagram.com/kiran_mentorship?igsh=MXR2aHNpenF5cXFpeA==" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@kiran_mentorship</a></p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs; 