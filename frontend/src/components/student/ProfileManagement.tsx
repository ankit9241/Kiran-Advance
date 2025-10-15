'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../App';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  studentId?: string;
  stream?: string;
  studentClass?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  bio?: string;
  preferredSubjects?: string[];
  learningGoals?: string;
  targetExam?: string;
  profileImage?: string;
  profilePicture?: string;
  isApproved?: boolean;
  address?: {
    city?: string;
    state?: string;
    [key: string]: any;
  };
  emergencyContact?: {
    name?: string;
    relation?: string;
    phone?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ProfileManagementProps {
  user: UserProfile;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  stream: string;
  studentClass: string;
  dateOfBirth: string;
  gender: string;
  address: {
    city: string;
    state: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  bio: string;
  preferredSubjects: string[];
  learningGoals: string;
  targetExam: string;
  profilePicture: string;
  profilePictureFile: File | null;
}

export default function ProfileManagement({ user: propUser }: ProfileManagementProps) {
  const { user: authUser, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Merge prop user with auth user, with auth user taking precedence
  const user: UserProfile = {
    ...propUser,
    ...authUser,
    address: {
      ...(propUser?.address || {}),
      ...(authUser?.address || {})
    },
    emergencyContact: {
      ...(propUser?.emergencyContact || {}),
      ...(authUser?.emergencyContact || {})
    }
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    stream: '',
    studentClass: '',
    dateOfBirth: '',
    gender: 'male',
    address: {
      city: '',
      state: ''
    },
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    bio: '',
    preferredSubjects: [],
    learningGoals: '',
    targetExam: '',
    profilePicture: user.avatar || '/images/default-avatar.png',
    profilePictureFile: null
  });

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const apiResponse = await response.json();
          const userData = apiResponse?.data || apiResponse; // Handle both response formats
          console.log('📋 API Response received:', apiResponse);
          console.log('👤 User data extracted:', userData);
          
          if (userData) {
            // Update auth context with fresh data
            if (setUser) {
              setUser(userData);
            }
            
            // Update local state
            // Safely extract nested properties with defaults
            const userAddress = userData?.address || {};
            const userEmergencyContact = userData?.emergencyContact || {};
            const userProfileImage = userData?.profileImage || userData?.profilePicture || userData?.avatar || user?.avatar || '/images/default-avatar.png';
            
            setProfileData(prev => ({
              ...prev,
              name: userData?.name || '',
              email: userData?.email || '',
              phone: userData?.phone || '',
              studentId: userData?.studentId || '',
              stream: userData?.stream || '',
              studentClass: userData?.studentClass || '',
              dateOfBirth: formatDateForInput(userData?.dateOfBirth) || '',
              gender: userData?.gender || 'male',
              bio: userData?.bio || '',
              preferredSubjects: Array.isArray(userData?.preferredSubjects) 
                ? [...userData.preferredSubjects] 
                : [],
              learningGoals: userData?.learningGoals || '',
              targetExam: userData?.targetExam || '',
              profilePicture: userProfileImage,
              address: {
                city: userAddress?.city || '',
                state: userAddress?.state || ''
              },
              emergencyContact: {
                name: userEmergencyContact?.name || '',
                relation: userEmergencyContact?.relation || '',
                phone: userEmergencyContact?.phone || ''
              }
            }));
          }
        } else {
          console.error('❌ Failed to fetch user data:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: 'address' | 'emergencyContact', field: string, value: string) => {
    setProfileData(prev => {
      // Safely get the parent object with a type assertion
      const parentObj = (prev[parent] || {}) as Record<string, any>;
      
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value
        }
      };
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Add all profile data to formData
      Object.entries(profileData).forEach(([key, value]) => {
        if (key === 'profilePictureFile' && value) {
          formData.append('profileImage', value);
        } else if (key === 'address' || key === 'emergencyContact') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'preferredSubjects' && Array.isArray(value)) {
          formData.append('preferredSubjects', value.join(','));
        } else if (key !== 'profilePictureFile' && value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:5000/api/v1/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await response.json();
      if (setUser && authUser) {
        setUser({
          ...authUser,
          ...responseData.data,
          profileImage: responseData.data.profileImage || authUser.profileImage
        });
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-picture-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {profileData.name} • {profileData.studentId || 'Student'}
            </p>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Edit Profile'
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/default-avatar.png';
                    }}
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfileData(prev => ({
                          ...prev,
                          profilePicture: reader.result as string,
                          profilePictureFile: file
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {profileData.studentClass && `${profileData.studentClass} • `}
                  {profileData.stream}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">{profileData.name}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profileData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">{profileData.phone || 'Not provided'}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900 capitalize">
                        {profileData.gender || 'Not provided'}
                      </dd>
                    )}
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profileData.studentId || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Class</dt>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.studentClass}
                        onChange={(e) => handleInputChange('studentClass', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">{profileData.studentClass || 'Not provided'}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Stream</dt>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.stream}
                        onChange={(e) => handleInputChange('stream', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">{profileData.stream || 'Not provided'}</dd>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Target Exam</dt>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.targetExam}
                        onChange={(e) => handleInputChange('targetExam', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="e.g., JEE, NEET, UPSC"
                      />
                    ) : (
                      <dd className="mt-1 text-sm text-gray-900">{profileData.targetExam || 'Not specified'}</dd>
                    )}
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address.city}
                      onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.address.city || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address.state}
                      onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.address.state || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.emergencyContact.name || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.emergencyContact.relation}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relation', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g., Father, Mother"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.emergencyContact.relation || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.emergencyContact.phone}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.emergencyContact.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-line">
                  {profileData.bio || 'No bio provided'}
                </p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h3>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={profileData.learningGoals}
                  onChange={(e) => handleInputChange('learningGoals', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="What are your learning goals?"
                />
              ) : (
                <p className="text-sm text-gray-900 whitespace-pre-line">
                  {profileData.learningGoals || 'No learning goals specified'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
