import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

// Define the form data interface
interface MentorFormData {
  // Personal Information
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  bio: string;
  profilePicture: File | null;
  dateOfBirth: string;
  
  // Professional Information
  subjects: string[];
  specializations: string[];
  experience: string;
  education: string[];
  achievements: string[];
  teachingStyle: string;
  
  // Contact Information
  address: {
    city: string;
    state: string;
  };
  linkedin: string;
  website: string;
  telegramId: string;
  whatsapp: string;
  
  // Documents
  cv: File | null;
  certificates: File[];
  
  // Availability
  timezone: string;
  schedule: string;
  currentStatus: string;
  
  // Additional
  languages: string[];
}

const RegisterMentor = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<MentorFormData>({
    // Personal Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bio: '',
    profilePicture: null,
    dateOfBirth: '',
    
    // Professional Information
    subjects: [],
    specializations: [],
    experience: '',
    education: [],
    achievements: [],
    teachingStyle: '',
    
    // Contact Information
    address: {
      city: '',
      state: ''
    },
    linkedin: '',
    website: '',
    telegramId: '',
    whatsapp: '',
    
    // Documents
    cv: null,
    certificates: [],
    
    // Availability
    timezone: '',
    schedule: '',
    currentStatus: '',
    
    // Additional
    languages: ['English']
  });

  // State for new items to be added to arrays
  const [newSubject, setNewSubject] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Tab configuration
  const tabs = [
    { id: 'personal', name: 'Personal', icon: 'ri-user-line' },
    { id: 'professional', name: 'Professional', icon: 'ri-briefcase-line' },
    { id: 'contact', name: 'Contact', icon: 'ri-contacts-line' },
    { id: 'review', name: 'Review', icon: 'ri-eye-line' },
  ];

  // Navigation between tabs
  const nextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      // Scroll to top when changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      // Scroll to top when changing tabs
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'profilePicture' || name === 'cv') {
        setForm(prev => ({
          ...prev,
          [name]: files[0]
        }));
      } else if (name === 'certificates') {
        setForm(prev => ({
          ...prev,
          certificates: [...prev.certificates, ...Array.from(files)]
        }));
      }
    }
  };

  // Handle array operations
  const addItem = (arrayName: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim() === '') return;
    
    setForm(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName as keyof MentorFormData] as string[], value]
    }));
    
    setValue('');
  };

  const removeItem = (arrayName: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof MentorFormData] as string[]).filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'address') {
          formData.append('city', value.city);
          formData.append('state', value.state);
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[]`, item);
            } else {
              formData.append(`${key}[]`, item);
            }
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Submit form data to the server
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Login the user after successful registration
      await login('mentor', { token: data.token, ...data.user });
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-2">
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-4xl space-y-6 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-4">Mentor Registration</h2>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <i className={`${tab.icon} text-lg`}></i>
                </button>
                <span className="text-xs mt-1 text-gray-600">{tab.name}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-center font-semibold mb-2 p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">Full Name*</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                  required 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email*</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                  required 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Password*</label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                  required 
                  placeholder="Enter your password" 
                  minLength={8} 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password*</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                  required 
                  placeholder="Confirm your password" 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number*</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                  required 
                  placeholder="Enter your phone number" 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={form.dateOfBirth} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50" 
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Bio*</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={nextTab}
                className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Next: Professional Info <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
        )}
        
        {/* Professional Information Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Information</h3>
            
            <div className="space-y-6">
              {/* Subjects */}
              <div>
                <label className="block font-medium mb-1">Subjects You Can Teach*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('subjects', newSubject, setNewSubject))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('subjects', newSubject, setNewSubject)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-800"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => removeItem('subjects', index)}
                          className="text-blue-600 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Experience */}
              <div>
                <label className="block font-medium mb-1">Years of Experience*</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="e.g. 3.5"
                />
              </div>
              
              {/* Education */}
              <div>
                <label className="block font-medium mb-1">Education & Certifications*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('education', newEducation, setNewEducation))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., B.Tech in Computer Science from IIT Bombay (2020)"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('education', newEducation, setNewEducation)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.education.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {form.education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-purple-50 px-4 py-2 rounded-lg border border-purple-100"
                      >
                        <span className="text-sm">{edu}</span>
                        <button
                          type="button"
                          onClick={() => removeItem('education', index)}
                          className="text-purple-600 hover:text-red-500 p-1 -mr-2"
                          title="Remove entry"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Achievements */}
              <div>
                <label className="block font-medium mb-1">Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('achievements', newAchievement, setNewAchievement))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Published research paper, Teaching award, etc."
                  />
                  <button
                    type="button"
                    onClick={() => addItem('achievements', newAchievement, setNewAchievement)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.achievements.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {form.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100"
                      >
                        <span className="text-sm">{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeItem('achievements', index)}
                          className="text-yellow-600 hover:text-red-500 p-1 -mr-2"
                          title="Remove achievement"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* CV Upload */}
              <div>
                <label className="block font-medium mb-1">CV/Resume*</label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  required
                />
                {form.cv && (
                  <p className="mt-1 text-sm text-gray-600">Selected: {form.cv.name}</p>
                )}
              </div>
              
              {/* Certificates */}
              <div>
                <label className="block font-medium mb-1">Additional Certificates (Optional)</label>
                <input
                  type="file"
                  name="certificates"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {form.certificates.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <div className="space-y-1">
                      {form.certificates.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm truncate max-w-xs">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                certificates: prev.certificates.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Teaching Style */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Teaching Style</label>
                <textarea
                  name="teachingStyle"
                  value={form.teachingStyle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  placeholder="Describe your teaching approach and methodology..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevTab}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm leading-tight uppercase rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                <i className="ri-arrow-left-line mr-1"></i> Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Next: Contact Info <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
        )}
        
        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Review Your Information</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{form.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{form.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{form.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{form.dateOfBirth || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="font-medium whitespace-pre-line">{form.bio || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Professional Information</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Subjects</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {form.subjects.length > 0 ? (
                        form.subjects.map((subject, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {subject}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No subjects added</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Years of Experience</p>
                    <p className="font-medium">{form.experience || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Education & Certifications</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {form.education.length > 0 ? (
                        form.education.map((edu, index) => (
                          <li key={index} className="font-medium">{edu}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No education entries added</li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Achievements</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {form.achievements.length > 0 ? (
                        form.achievements.map((achievement, index) => (
                          <li key={index} className="font-medium">{achievement}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No achievements added</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {form.address.city || form.address.state 
                        ? `${form.address.city || ''}${form.address.city && form.address.state ? ', ' : ''}${form.address.state || ''}`
                        : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timezone</p>
                    <p className="font-medium">{form.timezone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <p className="font-medium">{form.linkedin || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium">{form.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telegram</p>
                    <p className="font-medium">{form.telegramId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-medium">{form.whatsapp || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium whitespace-pre-line">{form.schedule || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I confirm that all the information provided is accurate to the best of my knowledge.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevTab}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm leading-tight uppercase rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                <i className="ri-arrow-left-line mr-1"></i> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-green-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">City*</label>
                <input
                  type="text"
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="Enter your city"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">State*</label>
                <input
                  type="text"
                  name="address.state"
                  value={form.address.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="Enter your state"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Website/Blog</label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Telegram Username</label>
                <input
                  type="text"
                  name="telegramId"
                  value={form.telegramId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  placeholder="@yourusername"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Timezone*</label>
                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                >
                  <option value="">Select your timezone</option>
                  <option value="Asia/Kolkata">India (IST, UTC+5:30)</option>
                  <option value="America/New_York">Eastern Time (ET, UTC-5:00)</option>
                  <option value="America/Chicago">Central Time (CT, UTC-6:00)</option>
                  <option value="America/Denver">Mountain Time (MT, UTC-7:00)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT, UTC-8:00)</option>
                  <option value="Europe/London">London (GMT, UTC+0:00)</option>
                  <option value="Europe/Paris">Central European Time (CET, UTC+1:00)</option>
                  <option value="Asia/Singapore">Singapore (SGT, UTC+8:00)</option>
                  <option value="Asia/Tokyo">Japan (JST, UTC+9:00)</option>
                  <option value="Australia/Sydney">Sydney (AEST, UTC+10:00)</option>
                </select>
              </div>
              
              <div>
                <label className="block font-medium mb-1">Current Status*</label>
                <select
                  name="currentStatus"
                  value={form.currentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                >
                  <option value="">Select your current status</option>
                  <option value="available">Available for new students</option>
                  <option value="limited">Limited availability</option>
                  <option value="full">Not currently accepting new students</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Availability Schedule*</label>
                <textarea
                  name="schedule"
                  value={form.schedule}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="e.g., Weekdays: 6 PM - 9 PM, Weekends: 10 AM - 6 PM"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Languages You're Comfortable Teaching In*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('languages', newLanguage, setNewLanguage))}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Hindi, Spanish, French"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('languages', newLanguage, setNewLanguage)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.languages.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full text-sm text-indigo-800"
                      >
                        {language}
                        {language !== 'English' && (
                          <button
                            type="button"
                            onClick={() => removeItem('languages', index)}
                            className="text-indigo-600 hover:text-red-500"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevTab}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm leading-tight uppercase rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                <i className="ri-arrow-left-line mr-1"></i> Back
              </button>
              <button
                type="button"
                onClick={nextTab}
                className="px-8 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Review & Submit <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
};

export default RegisterMentor;
