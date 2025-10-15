'use client';

import { useState, useEffect } from 'react';

// Mock authService since we don't have the actual implementation
const authService = {
  getProfile: async () => {
    // This is a mock implementation
    return {
      data: {
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          role: 'mentor',
          isVerified: true
        },
        profile: {
          specialization: ['Web Development', 'JavaScript'],
          expertise: ['React', 'TypeScript', 'Node.js'],
          experience: 5,
          bio: 'Experienced software developer and mentor',
          education: [
            'BSc Computer Science - Tech University (2018)'
          ],
          availability: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }
          ]
        },
        verificationStatus: 'approved'
      }
    };
  }
};

interface Qualification {
  degree: string;
  institution: string;
  year: string;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Profile {
  specialization: string[];
  expertise: string[];
  experience: number;
  bio: string;
  education: string[];  // Changed from qualifications to education array
  availability: Availability[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
}

interface MentorProfileProps {
  user?: User;
  onLogout?: () => void;
}

export default function MentorProfile({ user: propUser }: MentorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(propUser || null);
  const [formData, setFormData] = useState<Partial<User & Profile>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authService.getProfile();
        const userData = propUser || {
          ...res.data.user,
          id: res.data.user.id || 'default-id',
          role: res.data.user.role || 'mentor',
          isVerified: res.data.user.isVerified || false
        };
        
        if (!propUser) setUser(userData);
        setProfile(res.data.profile);
        
        setFormData({
          ...userData,
          ...res.data.profile,
          fullName: `${userData.firstName} ${userData.lastName}`.trim()
        });
        
        setVerificationStatus(res.data.verificationStatus);
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [propUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = (prev[field as keyof typeof prev] as string[]) || [];
      const newValues = value.split('\n').map(item => item.trim()).filter(Boolean);
      return {
        ...prev,
        [field]: [...new Set([...currentValues, ...newValues])]
      };
    });
  };

  const handleRemoveItem = (field: string, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter(item => item !== itemToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // In a real app, you would call an API to update the profile
      console.log('Updating profile with:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (user) {
        const [firstName, ...lastNameParts] = (formData.fullName || '').split(' ');
        const updatedUser = {
          ...user,
          firstName,
          lastName: lastNameParts.join(' ') || user.lastName,
          phoneNumber: formData.phoneNumber || user.phoneNumber
        };
        
        const updatedProfile = {
          ...profile,
          specialization: formData.specialization || [],
          expertise: formData.expertise || [],
          experience: formData.experience || 0,
          bio: formData.bio || ''
        } as Profile;
        
        setUser(updatedUser);
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 text-5xl mb-4">👤</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Profile Found</h2>
        <p className="text-gray-600">We couldn't find any profile data for this user.</p>
      </div>
    );
  }
  const renderEditableField = (label: string, name: string, type = 'text', isTextArea = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        isTextArea ? (
          <textarea
            name={name}
            value={formData[name as keyof typeof formData] as string || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData] as string || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        )
      ) : (
        <p className="text-gray-900">
          {(() => {
            const value = formData[name as keyof typeof formData];
            if (value === undefined || value === null) return '-';
            if (Array.isArray(value)) {
              return value.map(String).join(', ');
            }
            return String(value);
          })()}
        </p>
      )}
    </div>
  );

  const renderArrayField = (label: string, field: string, isComplex = false) => {
    const value = formData[field as keyof typeof formData];
    
    if (isComplex) {
      // Handle complex types like availability
      if (field === 'availability' && Array.isArray(value)) {
        // Existing availability handling code
        return null;
      }
      
      // Add similar handling for availability if needed
      return null;
    }

    // Handle simple string arrays
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isEditing ? (
          <div>
            <div className="flex mb-2">
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    handleArrayChange(field, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                placeholder="Type and press Enter to add"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    handleArrayChange(field, input.value);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(value) && value.map((item, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {String(item)}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(field, String(item))}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-900">
            {Array.isArray(value) ? value.join(', ') : '-'}
          </p>
        )}
      </div>
    );
  };

  if (verificationStatus !== 'approved') {
    return (
      <div className="p-8 text-center text-yellow-600">
        <h2 className="text-2xl font-bold mb-2">Your mentor account is pending admin approval.</h2>
        <p>You will be notified once your account is approved.</p>
      </div>
    );
  }

  // Handle cancel edit
  const handleCancel = () => {
    // Reset form data to original values
    if (user && profile) {
      setFormData({
        ...user,
        ...profile,
        fullName: `${user.firstName} ${user.lastName}`.trim()
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor Profile</h1>
            <p className="text-gray-600 mt-1">Manage your profile information and settings</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-user-line text-4xl text-blue-600"></i>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-600">{profile.specialization?.join(', ')}</p>
                    <p className="text-sm text-gray-500 mt-1">{profile.expertise?.join(', ')}</p>
                  </div>
                )}
                {isEditing && (
                  <button 
                    type="button"
                    className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-camera-line mr-2"></i>
                    Change Photo
                  </button>
                )}
              </div>
              {!isEditing && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-mail-line text-gray-500"></i>
                    </div>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-phone-line text-gray-500"></i>
                    </div>
                    <span className="text-gray-700">{user.phoneNumber || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-time-line text-gray-500"></i>
                    </div>
                    <span className="text-gray-700">{profile.experience} years experience</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderArrayField('Specialization', 'specialization')}
                {renderArrayField('Expertise', 'expertise')}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience || 0}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.experience || '0'} years</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-line">{formData.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Education & Certifications</h3>
              {renderArrayField('', 'education')}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Availability</h3>
              {profile.availability?.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-900">
                  {profile.availability.map((a, idx) => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <li key={idx} className="mb-1">
                        {days[a.dayOfWeek]}: {a.startTime} - {a.endTime}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">No availability set</p>
              )}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}