import React, { useState } from 'react';

const supportTopics = [
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

const Support = () => {
  const [form, setForm] = useState({ name: '', email: '', issue: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Support Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-6">Support Center</h1>
          <p className="text-gray-600 mb-6">Need help? Submit a support request or check our <a href='/faq' className='text-blue-600 hover:underline'>FAQ</a> and <a href='/contact' className='text-blue-600 hover:underline'>Contact</a> pages.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
              <input type="text" name="issue" value={form.issue} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea name="details" value={form.details} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 resize-none" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold text-lg shadow hover:from-blue-700 hover:to-green-600 transition">Submit</button>
            {submitted && <div className="mt-4 p-4 rounded-lg text-center font-medium bg-green-50 text-green-700">Thank you! Your request has been received.</div>}
          </form>
        </div>
        {/* Support Topics Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Common Support Topics</h2>
          <ul className="space-y-4">
            {supportTopics.map((topic, idx) => (
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
};

export default Support; 