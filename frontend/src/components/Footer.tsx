
'use client';

import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-pacifico">
                <b>KIRAN</b>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-6 max-w-md">
              Connecting students and mentors in a comprehensive learning management platform. 
              Empowering education through technology and personalized mentorship.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><i className="ri-facebook-fill text-lg"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><i className="ri-twitter-fill text-lg"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><i className="ri-linkedin-fill text-lg"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><i className="ri-mail-line text-lg"></i></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="footer-link">Features</Link></li>
              <li><Link to="/about" className="footer-link">How It Works</Link></li>
              <li><a href="/testimonials" className="footer-link">Testimonials</a></li>
              <li><Link to="/contact-sales" className="footer-link">Contact Sales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/support" className="footer-link">Support</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {currentYear} KIRAN. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <style>{`
        .footer-link {
          @apply text-gray-600 hover:text-blue-600 text-sm transition-colors cursor-pointer rounded px-2 py-1 hover:bg-blue-50;
        }
      `}</style>
    </footer>
  );
}
