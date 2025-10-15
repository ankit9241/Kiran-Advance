import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const getDashboardRoute = (role: string | null) => {
  if (role === 'admin') return '/admin';
  if (role === 'mentor') return '/mentor';
  if (role === 'student') return '/student';
  return '/';
};

const Error404 = () => {
  const { isLoggedIn, userRole } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="flex flex-col items-center">
        <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="404 Not Found" className="w-64 h-64 object-contain mb-6 rounded-xl shadow-lg" />
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-lg w-full text-center">
          <p className="text-5xl font-extrabold text-blue-700 mb-2">404</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-6">Please check the URL in the address bar and try again.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isLoggedIn ? getDashboardRoute(userRole) : '/'}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              <span className="mr-2">🏠</span>
              Go to Dashboard
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404; 