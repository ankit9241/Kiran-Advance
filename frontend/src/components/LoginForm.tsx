'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import api, { auth } from '../utils/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser, setUserRole, setIsLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      console.log('Attempting login with email:', email);
      
      // Clear any existing auth data before login
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      
      // Use the auth service to make the login request
      const response = await auth.login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { data } = response;
      
      console.log('Login response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      // Extract token and user data from response
      const token = data.token;
      const userData = data.data; // This contains all user data
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      if (!userData || !userData.role) {
        throw new Error('Invalid user data received from server');
      }

      // Normalize role first
      const normalizedRole = userData.role.toLowerCase();

      // Store all auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', normalizedRole);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update auth context with normalized role
      setUser(userData);
      setUserRole(normalizedRole);
      setIsLoggedIn(true);
      
      console.log('✅ User authenticated successfully:', {
        role: normalizedRole,
        userId: userData.id,
        userName: userData.name,
        isApproved: userData.isApproved
      });
      
      // Close the login modal
      onClose();
      
      console.log('🏁 Determining redirect route for role:', normalizedRole);
      
      // Redirect based on user role and approval status
      if (normalizedRole === 'mentor' && !userData.isApproved) {
        console.log('🛑 Redirecting to mentor pending approval');
        navigate('/mentor/pending-approval');
      } else if (normalizedRole === 'admin') {
        console.log('👑 Redirecting to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log(`📍 Redirecting to /${normalizedRole}`);
        navigate(`/${normalizedRole}`);
      }
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality is not implemented yet.');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white p-8 rounded-xl shadow-xl w-full max-w-md z-10 space-y-6">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Sign In</h2>
        <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 mb-2 hover:bg-gray-100 transition">
          <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.5 24.5C47.5 22.8 47.3 21.2 47 19.7H24V28.3H37.2C36.6 31.2 34.7 33.6 32 35.1V40.1H39.6C44.1 36.1 47.5 30.9 47.5 24.5Z" fill="#4285F4"/>
              <path d="M24 48C30.5 48 35.9 45.9 39.6 40.1L32 35.1C30.1 36.3 27.7 37.1 24 37.1C18.7 37.1 14.1 33.7 12.5 29.1H4.7V34.3C8.4 41.1 15.6 48 24 48Z" fill="#34A853"/>
              <path d="M12.5 29.1C11.9 27.3 11.6 25.3 11.6 23.3C11.6 21.3 11.9 19.3 12.5 17.5V12.3H4.7C2.7 16.1 1.5 20.1 1.5 24.5C1.5 28.9 2.7 32.9 4.7 36.7L12.5 29.1Z" fill="#FBBC05"/>
              <path d="M24 9.9C27.1 9.9 29.7 11 31.7 12.8L39.8 5.1C35.9 1.5 30.5 0 24 0C15.6 0 8.4 6.9 4.7 12.3L12.5 17.5C14.1 13.1 18.7 9.9 24 9.9Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>
        {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}
        <label className="block font-medium mt-2">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400" required placeholder="Enter your email" />
        <label className="block font-medium mt-2">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-400" 
            required 
            placeholder="Enter your password" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
          <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                Forgot password?
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account? Register as{' '}
          <span className="text-blue-600 hover:underline cursor-pointer font-medium" onClick={() => { onClose(); navigate('/register-student'); }}>Student</span>{' '}or{' '}
          <span className="text-green-600 hover:underline cursor-pointer font-medium" onClick={() => { onClose(); navigate('/register-mentor'); }}>Mentor</span>
              </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors mt-2">Sign In</button>
      </form>
    </div>
  );
};

export default LoginForm;