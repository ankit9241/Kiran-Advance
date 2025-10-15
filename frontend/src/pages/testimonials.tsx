import React from 'react';

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Student, Class 12',
    feedback: 'KIRAN helped me clear my doubts quickly and stay motivated for my board exams. The mentors are amazing!',
    avatar: '/assets/avatar-student1.png',
  },
  {
    name: 'Rakesh K.',
    role: 'Mentor',
    feedback: 'The platform made it easy to track my students’ progress and provide targeted guidance. The dashboard is intuitive and powerful.',
    avatar: '/assets/avatar-mentor1.png',
  },
  {
    name: 'Sunita M.',
    role: 'Parent',
    feedback: 'My child has improved so much with the help of KIRAN mentors. The resources and support are excellent.',
    avatar: '/assets/avatar-parent1.png',
  },
  {
    name: 'Green Valley School',
    role: 'School Administrator',
    feedback: 'We onboarded 200+ students in a week. The admin dashboard is a game changer for our school.',
    avatar: '/assets/avatar-school.png',
  },
];

const Testimonials = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-4 text-center">What Our Users Say</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Real stories from students, mentors, and schools who have experienced the power of KIRAN.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100 shadow"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
            <p className="text-gray-700 text-lg mb-4 italic">“{t.feedback}”</p>
            <div className="font-bold text-blue-700">{t.name}</div>
            <div className="text-sm text-gray-500">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials; 