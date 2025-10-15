import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const GoogleIcon = () => (
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
);

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
  education: string[];  // Now includes both education and certifications
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
    education: [],  // Now includes both education and certifications
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setUserRole, setIsLoggedIn } = useAuth();

  // State for array input fields
  const [newSubject, setNewSubject] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  
  // Handle adding a new subject
  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim() && !form.subjects.includes(newSubject.trim())) {
      setForm(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };
  
  // Handle removing a subject
  const removeSubject = (index: number) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Handle adding a new education entry
  const addEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEducation.trim() && !form.education.includes(newEducation.trim())) {
      setForm(prev => ({
        ...prev,
        education: [...prev.education, newEducation.trim()]
      }));
      setNewEducation('');
    }
  };
  
  // Handle removing an education entry
  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // Handle adding a new education/certification entry
  const handleEducationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEducation(e as any);
    }
  };

  // Handle adding a new specialization
  const addSpecialization = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialization.trim() && !form.specializations.includes(newSpecialization.trim())) {
      setForm(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  // Handle adding a new achievement
  const addAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAchievement.trim() && !form.achievements.includes(newAchievement.trim())) {
      setForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  // Handle removing an achievement
  const removeAchievement = (index: number) => {
    setForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Handle adding a new language
  const addLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLanguage.trim() && !form.languages.includes(newLanguage.trim())) {
      setForm(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  // Handle removing a language
  const removeLanguage = (index: number) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };
  
  // Handle removing a specialization
  const removeSpecialization = (index: number) => {
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        setForm(prev => ({ ...prev, [name]: fileInput.files![0] }));
      }
    } else if (e.target.type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    const requiredFields = [
      { field: form.name, name: 'Full Name' },
      { field: form.email, name: 'Email' },
      { field: form.password, name: 'Password' },
      { field: form.confirmPassword, name: 'Confirm Password' },
      { field: form.phone, name: 'Phone Number' },
      { field: form.experience, name: 'Years of Experience' },
      { field: form.bio, name: 'Bio' },
      { field: form.profilePicture, name: 'Profile Picture' },
      { field: form.cv, name: 'CV/Resume' }
    ];
    
    const missingField = requiredFields.find(field => !field.field);
    if (missingField) {
      setError(`Please fill in the required field: ${missingField.name}`);
      return;
    }
    
    // Validate array fields
    if (form.subjects.length === 0) {
      setError('Please add at least one subject you can teach.');
      return;
    }
    
    if (form.specializations.length === 0) {
      setError('Please add at least one specialization.');
      return;
    }
    
    if (form.education.length === 0) {
      setError('Please add at least one education or certification entry.');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Validate file types and sizes
    if (form.profilePicture) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(form.profilePicture.type)) {
        setError('Profile picture must be a JPG, PNG, or GIF image.');
        return;
      }
      if (form.profilePicture.size > 5 * 1024 * 1024) { // 5MB
        setError('Profile picture must be less than 5MB.');
        return;
      }
    }
    
    if (form.cv) {
      const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validDocTypes.some(type => form.cv?.type.includes(type))) {
        setError('CV must be a PDF or Word document.');
        return;
      }
      if (form.cv.size > 10 * 1024 * 1024) { // 10MB
        setError('CV must be less than 10MB.');
        return;
      }
    }

    try {
      // Prepare form data for submission
      const formData = new FormData();
      
      // Prepare form data with proper typing
      const formFields = {
        ...form,
        role: 'mentor', // Explicitly set role
        education: form.education || [],
        subjects: form.subjects || [],
        specializations: form.specializations || [],
        achievements: form.achievements || [],
        languages: form.languages || ['English']
      };

      // Add all form fields to FormData
      Object.entries(formFields).forEach(([key, value]) => {
        // Skip file inputs and empty fields
        if (key === 'profilePicture' || key === 'cv' || key === 'certificates' || key === 'confirmPassword') {
          return;
        }
        
        // Convert arrays and objects to JSON strings
        if (Array.isArray(value) || (value && typeof value === 'object' && !(value instanceof File))) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Add files to FormData
      if (form.profilePicture) {
        formData.append('profileImage', form.profilePicture);
      }
      
      if (form.cv) {
        formData.append('cv', form.cv);
      }
      
      if (form.certificates && form.certificates.length > 0) {
        form.certificates.forEach((cert) => {
          formData.append('certificates', cert);
        });
      }
      
      // Make the API call to register endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser set it with the correct boundary
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const responseData = await response.json();
      
      // Update user state with response data
      setUser({
        id: responseData.user.id,
        name: form.name,
        email: form.email,
        isApproved: responseData.user.isApproved || false,
        role: 'mentor'
      });
      
      setUserRole('mentor');
      setIsLoggedIn(true);
      
      // Store the token
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }
      
      // Redirect to pending approval page
      navigate('/mentor/pending-approval');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'personal', name: 'Personal', icon: 'ri-user-line' },
    { id: 'professional', name: 'Professional', icon: 'ri-briefcase-line' },
    { id: 'contact', name: 'Contact', icon: 'ri-contacts-line' },
  ];

  // Navigation between tabs
  const nextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };
  
  const prevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
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
        {error && <div className="text-red-600 text-center font-semibold mb-2 p-3 bg-red-50 rounded-lg">{error}</div>}
        
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
                  minLength={8} 
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
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">CV/Resume*</label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  required
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
                  placeholder="Tell us about yourself, your teaching experience, and your teaching philosophy..."
                  required
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
              <div>
                <label className="block font-medium mb-2">Subjects You Can Teach*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject(e))}
                  />
                  <button
                    type="button"
                    onClick={addSubject}
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
                          onClick={() => removeSubject(index)}
                          className="text-blue-600 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Specializations*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Algebra, Quantum Physics, Organic Chemistry"
                  />
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full text-sm text-green-800"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
                          className="text-green-600 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Years of Experience*</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                  required
                  placeholder="e.g. 5"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Education & Certifications*</label>
                <p className="text-sm text-gray-500 mb-2">Add your degrees, diplomas, and professional certifications</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    onKeyDown={handleEducationKeyDown}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., B.Tech in Computer Science from IIT Bombay (2020) | Google Certified Educator"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.education.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Your Education & Certifications:</h4>
                    <div className="space-y-2">
                      {form.education.map((edu, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-purple-50 px-4 py-2 rounded-lg border border-purple-100"
                        >
                          <span className="text-sm">{edu}</span>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-purple-600 hover:text-red-500 p-1 -mr-2"
                            title="Remove entry"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Published research paper, Teaching award, etc."
                  />
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.achievements.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <div className="space-y-2">
                      {form.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100"
                        >
                          <span className="text-sm">{achievement}</span>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index)}
                            className="text-yellow-600 hover:text-red-500 p-1 -mr-2"
                            title="Remove achievement"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Teaching Style</label>
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
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      city: e.target.value
                    }
                  }))}
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
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      state: e.target.value
                    }
                  }))}
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
                <label className="block font-medium mb-2">Languages You're Comfortable Teaching In*</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                    placeholder="e.g., Hindi, English, Spanish"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
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
                            onClick={() => removeLanguage(index)}
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
              
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Additional Certificates (Optional)</label>
                <input
                  type="file"
                  name="certificates"
                  onChange={(e) => {
                    if (e.target.files) {
                      setForm(prev => ({
                        ...prev,
                        certificates: [...prev.certificates, ...Array.from(e.target.files || [])]
                      }));
                    }
                  }}
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
        {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Telegram ID</label>
                  <input 
                    type="text" 
                    name="telegramId" 
                    value={form.telegramId} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 bg-gray-50" 
                    placeholder="Enter your Telegram ID" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    name="whatsapp" 
                    value={form.whatsapp} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 bg-gray-50" 
                    placeholder="Enter your WhatsApp number" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">LinkedIn Profile</label>
                  <input 
                    type="url" 
                    name="linkedin" 
                    value={form.linkedin} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 bg-gray-50" 
                    placeholder="https://linkedin.com/in/yourprofile" 
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Website</label>
                  <input 
                    type="url" 
                    name="website" 
                    value={form.website} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 bg-gray-50" 
                    placeholder="https://yourwebsite.com" 
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
                    <option value="IST (UTC+5:30)">IST (UTC+5:30) - Indian Standard Time</option>
                    <option value="PST (UTC-8)">PST (UTC-8) - Pacific Time</option>
                    <option value="EST (UTC-5)">EST (UTC-5) - Eastern Time</option>
                    <option value="GMT (UTC+0)">GMT (UTC+0) - Greenwich Mean Time</option>
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
                    <option value="">Select your status</option>
                    <option value="Available for mentoring">Available for mentoring</option>
                    <option value="Limited availability">Limited availability</option>
                    <option value="Not currently available">Not currently available</option>
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
                    placeholder="e.g. Weekdays: 6 PM - 9 PM, Weekends: 10 AM - 6 PM"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Languages You're Comfortable Teaching In*</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.languages.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                        {lang}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeLanguage(index)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage(e))}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 bg-gray-50"
                      placeholder="e.g. Hindi, Tamil, etc."
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
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
                  className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i> Submit Application
                    </span>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default RegisterMentor;