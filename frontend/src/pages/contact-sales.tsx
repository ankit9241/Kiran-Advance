import React, { useState } from 'react';

const ContactSales = () => {
  const [form, setForm] = useState({ name: '', email: '', organization: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-6 text-center">Contact Our Sales Team</h1>
        <p className="text-gray-700 text-lg mb-6 text-center">Interested in KIRAN for your school, organization, or group? Want to discuss bulk onboarding, premium features, or partnerships? Fill out the form below and our sales team will get in touch with you soon.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization/School</label>
            <input type="text" name="organization" value={form.organization} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent text-base bg-gray-50" placeholder="Your organization or school (optional)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-transparent text-base bg-gray-50" placeholder="Phone number (optional)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message*</label>
            <textarea name="message" value={form.message} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 resize-none" placeholder="How can we help you?" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition">Send Message</button>
          {submitted && <div className="mt-4 p-4 rounded-lg text-center font-medium bg-green-50 text-green-700">Thank you! Our sales team will contact you soon.</div>}
        </form>
        <div className="mt-8 text-center text-gray-600 text-sm">
          For urgent inquiries, email us at <a href="mailto:adityasinghofficial296@gmail.com" className="text-blue-600 hover:underline">adityasinghofficial296@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default ContactSales; 