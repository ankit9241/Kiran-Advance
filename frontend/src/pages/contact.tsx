import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<null | { success: boolean; message: string }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ success: true, message: 'Message sent successfully! (Demo only)' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between border border-gray-100">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-6">Have questions or need support? Get in touch with us.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600"><i className="ri-mail-line text-2xl"></i></span>
                <span className="text-gray-700 text-base">adityasinghofficial296@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600"><i className="ri-telegram-line text-2xl"></i></span>
                <a href="https://t.me/Aditya22906" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-base">@Aditya22906</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600"><i className="ri-instagram-line text-2xl"></i></span>
                <a href="https://www.instagram.com/kiran_mentorship?igsh=MXR2aHNpenF5cXFpeA==" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline text-base">@kiran_mentorship</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600"><i className="ri-map-pin-line text-2xl"></i></span>
                <span className="text-gray-700 text-base">Jamshedpur, Jharkhand, India</span>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <a href="/faq" className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition">FAQ</a>
              <a href="/support" className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100 transition">Support Center</a>
              <a href="/terms" className="px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition">Terms of Service</a>
            </div>
          </div>
        </div>
        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 resize-none"
                required
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold text-lg shadow hover:from-blue-700 hover:to-green-600 transition">Send Message</button>
            {submitStatus && (
              <div className={`mt-4 p-4 rounded-lg text-center font-medium ${submitStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact; 