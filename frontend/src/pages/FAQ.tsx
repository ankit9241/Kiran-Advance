import React, { useState } from 'react';

const faqs = [
  {
    question: 'How do I enroll as a student?',
    answer: 'Click on the Enroll link in the navigation bar and fill out the registration form. You can sign up manually or with Google.'
  },
  {
    question: 'How do I contact my mentor?',
    answer: 'You can find your assigned mentors in your dashboard and contact them via the provided contact methods.'
  },
  {
    question: 'How do I access study materials?',
    answer: 'Go to the Study Material page from the navigation bar to view all available resources.'
  },
  {
    question: 'How do I submit a doubt?',
    answer: 'Use the Doubt section in your dashboard to submit your questions. Mentors will respond as soon as possible.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on Forgot Password on the login page and follow the instructions to reset your password.'
  },
  {
    question: 'How do I get support?',
    answer: 'Use the Support Center page or the Contact Us form to reach out to our team.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-8 text-center">Frequently Asked Questions</h1>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className={openIndex === idx ? 'bg-blue-50 rounded-xl my-4 p-4 transition' : 'my-4 p-4 transition'}>
              <button
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 focus:outline-none"
                onClick={() => toggleFAQ(idx)}
              >
                <span>{faq.question}</span>
                <span className={`ml-4 text-2xl font-bold ${openIndex === idx ? 'text-blue-600' : 'text-gray-400'}`}>{openIndex === idx ? '-' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="mt-3 text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 