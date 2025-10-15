'use client';

import { Link, useNavigate } from 'react-router-dom';
interface HomepageProps {
  onLoginClick: () => void;
  showLogin?: boolean;
}

export default function Homepage({ onLoginClick }: HomepageProps) {
  const navigate = useNavigate();
  const features = [
    {
      title: 'Student Dashboard',
      description: 'Comprehensive learning interface with meetings, study materials, doubt resolution, and progress tracking.',
      icon: 'ri-graduation-cap-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Mentor Management',
      description: 'Powerful tools for mentors to track student progress, manage meetings, and provide personalized guidance.',
      icon: 'ri-user-star-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Admin Control',
      description: 'Complete platform oversight with user management, analytics, announcements, and system administration.',
      icon: 'ri-shield-user-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications for meetings, announcements, feedback, and important updates.',
      icon: 'ri-notification-2-line',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Study Material Management',
      description: 'Organized resource library with easy upload, approval workflow, and categorized access for all users.',
      icon: 'ri-book-open-line',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Meeting Integration',
      description: 'Seamless meeting scheduling, joining, recording access, and comprehensive session management tools.',
      icon: 'ri-video-chat-line',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const roles = [
    {
      title: 'Students',
      description: 'Access study materials, schedule mentorship sessions, ask questions, track progress, and receive personalized guidance.',
      features: ['Dashboard Overview', 'Study Materials', 'Doubt Resolution', 'Meeting Interface', 'Feedback System', 'Profile Management'],
      image: '/assets/students.png'
    },
    {
      title: 'Mentors',
      description: 'Guide students effectively with comprehensive tools for progress tracking, doubt resolution, and session management.',
      features: ['Student Progress Tracking', 'Doubt Queue Management', 'Meeting Scheduling', 'Material Upload', 'Feedback Review', 'Profile Settings'],
      image: '/assets/mentor.png'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* PublicNavbar removed, handled by layout */}
      
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen flex items-center"
        style={{ background: 'linear-gradient(120deg, #e0f2fe 0%, #fff 50%, #bbf7d0 100%)' }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20educational%20technology%20background%20with%20abstract%20geometric%20patterns%2C%20soft%20blue%20and%20green%20gradient%20colors%2C%20clean%20minimalist%20design%20with%20subtle%20connectivity%20elements%20and%20learning%20symbols&width=1920&height=1080&seq=hero-bg&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Learning with
                  <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Smart Mentorship
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-6 leading-relaxed max-w-2xl">
                  Connect students and mentors in a comprehensive platform designed for effective online education, 
                  personalized mentorship, and seamless learning management.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register/student">
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg cursor-pointer whitespace-nowrap transform hover:scale-105">
                      Start as Student
                    </button>
                  </Link>
                  <Link to="/register/mentor">
                    <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold text-lg cursor-pointer whitespace-nowrap transform hover:scale-105">
                      Start as Mentor
                    </button>
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">150+</div>
                  <div className="text-sm text-gray-600">Expert Mentors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/assets/dashboard.jpg"
                alt="KIRAN Student Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every User
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools needed for effective online learning and mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <i className={`${feature.icon} text-2xl ${feature.color}`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Every Role
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're a student seeking guidance or a mentor sharing knowledge, we've built tools specifically for your needs.
            </p>
          </div>

          <div className="space-y-20">
            {roles.map((role, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      For {role.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(role.title === 'Students' ? '/register-student' : '/register-mentor')}
                    className={`px-6 py-3 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors ${role.title === 'Students' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    Start as {role.title.slice(0, -1)}
                  </button>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <img
                    src={role.image}
                    alt={`${role.title} Dashboard`}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of students and mentors who are already using KIRAN 
            to create meaningful educational connections and achieve learning success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register-student')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold text-lg cursor-pointer whitespace-nowrap transform hover:scale-105"
            >
              Sign Up Now
            </button>
            <button 
              onClick={() => navigate('/contact-sales')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold text-lg cursor-pointer whitespace-nowrap"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer removed, handled by layout */}
    </div>
  );
}
