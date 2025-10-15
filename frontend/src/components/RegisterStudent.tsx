import * as React from 'react';
import { useState, ChangeEvent, FormEvent, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaCalendarAlt,
  FaGraduationCap, FaBook, FaSchool, FaPlus, FaTimes,
  FaChevronLeft, FaChevronRight, FaImage, FaGlobe
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { auth } from '../utils/api';

// Style Constants
const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200";
const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
const buttonClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
const cardClasses = "bg-white p-6 rounded-xl shadow-md border border-gray-200";
const sectionTitleClasses = "text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200";
const errorClasses = "mt-1 text-sm text-red-600";
const successClasses = "mt-1 text-sm text-green-600";
const disabledButtonClasses = "opacity-50 cursor-not-allowed";
const formGroupClasses = "mb-4";

// Form Constants
const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'Hindi', 'Physical Education', 'Economics', 'Accountancy',
  'Business Studies', 'History', 'Geography'];

const TARGET_EXAMS = ['JEE Main', 'JEE Advanced', 'NEET', 'UPSC', 'GATE', 'Other'];

const STEPS: Step[] = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'education', title: 'Education' },
  { id: 'additional', title: 'Additional Info' },
  { id: 'review', title: 'Review & Submit' }
];

// Board options for the select dropdown
const BOARD_OPTIONS = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'State Board', label: 'State Board' },
  { value: 'IGCSE', label: 'IGCSE' },
  { value: 'IB', label: 'IB' },
  { value: 'Other', label: 'Other' }
];

// Stream options for the select dropdown
const STREAM_OPTIONS = [
  { value: 'Science', label: 'Science' },
  { value: 'Commerce', label: 'Commerce' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Other', label: 'Other' }
];

// Types
interface Step {
  id: string;
  title: string;
  icon?: React.ReactNode; // Make icon optional
}

interface Address {
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface FormData {
  // Personal Information
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Education Information - aligned with backend
  studentClass: string;
  stream: string;
  board: string;
  schoolCollegeName: string;
  preferredSubjects: string[];
  targetExams: string[];
  targetExam: string;
  learningGoals: string;
  
  // Additional Information
  bio: string;
  hobbies: string[];
  profilePicture: File | null;
  
  // Address - flattened to match backend
  address: {
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  
  // Form control
  agreeToTerms: boolean;
  [key: string]: any;
}

const RegisterStudent: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { setUser, setUserRole, setIsLoggedIn } = useAuth();
  
  // Form state
  const [form, setForm] = useState<FormData>({
    // Personal Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Education Information
    studentClass: '',
    stream: '',
    board: '',
    schoolCollegeName: '',
    preferredSubjects: [],
    targetExams: [],
    targetExam: '',
    learningGoals: '',
    
    // Additional Information
    bio: '',
    hobbies: [],
    profilePicture: null,
    
    // Address
    address: {
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    
    // Form control
    agreeToTerms: false
  });

  // UI State
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Input states for dynamic fields
  const [newSubject, setNewSubject] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newExam, setNewExam] = useState('');
  
  // Step navigation helpers
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, profilePicture: e.target.files[0] });
    }
  };

  // Handler functions for adding items to arrays
  const handleAddItem = (field: keyof FormData, newItem: string) => {
    if (newItem.trim() && !(form[field] as string[]).includes(newItem.trim())) {
      setForm(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), newItem.trim()]
      }));
      if (field === 'preferredSubjects') {
        setNewSubject('');
      } else if (field === 'hobbies') {
        setNewHobby('');
      } else if (field === 'targetExams') {
        setNewExam('');
      }
    }
  };

  // Alias functions for better readability in JSX
  const handleAddSubject = () => handleAddItem('preferredSubjects', newSubject);
  const handleAddHobby = () => handleAddItem('hobbies', newHobby);
  const handleAddExam = () => handleAddItem('targetExams', newExam);

  // Remove item from array field
  const removeFromArray = (field: keyof FormData, index: number) => {
    if (Array.isArray(form[field])) {
      setForm(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Prepare registration data to match backend expectations
      const registrationData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender || 'prefer-not-to-say',
        stream: form.stream,
        studentClass: form.studentClass,
        bio: form.bio,
        address: {
          city: form.address.city,
          state: form.address.state,
          country: form.address.country,
          pincode: form.address.pincode
        },
        preferredSubjects: form.preferredSubjects,
        learningGoals: form.learningGoals,
        targetExam: form.targetExams.join(', '),
        targetExams: form.targetExams,
        hobbies: form.hobbies,
        schoolCollegeName: form.schoolCollegeName,
        board: form.board,
        role: 'student'
      };

      console.log('Sending registration data:', registrationData);

      // Register student using the auth service
      const response = await auth.registerStudent(registrationData);
      
      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Extract user data and token
        const { token, user } = response.data;
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        setUser(user);
        setUserRole('student');
        setIsLoggedIn(true);
        
        console.log('Student registered successfully');
        
        // Navigate to student dashboard
        navigate('/student/dashboard');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle next step or form submission
  const nextStep = () => {
    if (isStepValid()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
        setError(null);
      } else {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      }
    } else {
      setError('Please fill in all required fields');
    }
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
  };

  // Check if the current step is valid
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          !!form.name &&
          !!form.email &&
          !!form.password &&
          form.password === form.confirmPassword &&
          !!form.phone &&
          !!form.dateOfBirth &&
          !!form.address.city &&
          !!form.address.state &&
          !!form.address.country &&
          !!form.address.pincode
        );
      case 1: // Education
        return (
          !!form.schoolCollegeName &&
          !!form.classGrade && 
          !!form.stream && 
          !!form.board &&
          form.currentSubjects.length > 0
        );
      case 2: // Additional Info
        return true; // No validation needed for additional info step
      case 3: // Review & Submit
        return form.agreeToTerms; // Must agree to terms to submit
      default:
        return false;
    }
  };

  // Render the current step of the form
  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-6">
            <h2 className={sectionTitleClasses}>Personal Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Contact Information */}
              <div className="col-span-full mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={form.address.city}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>State *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={form.address.state}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Country *</label>
                    <input
                      type="text"
                      name="address.country"
                      value={form.address.country}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Pincode *</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={form.address.pincode}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Education (Combined Academic and Education Details)
        return (
          <div className="space-y-6">
            <h2 className={sectionTitleClasses}>Education Details</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClasses}>School/College Name *</label>
                <input
                  type="text"
                  name="schoolCollegeName"
                  value={form.schoolCollegeName}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="Enter your school or college name"
                />
              </div>
              <div>
                <label className={labelClasses}>Class/Grade *</label>
                <input
                  type="text"
                  id="classGrade"
                  name="classGrade"
                  value={form.classGrade}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Stream *</label>
                <select
                  id="stream"
                  name="stream"
                  value={form.stream}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">Select Stream</option>
                  {STREAM_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Board *</label>
                <select
                  id="board"
                  name="board"
                  value={form.board}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option value="">Select Board</option>
                  {BOARD_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Current Subjects</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={newSubject}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="flex-1 min-w-0 block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add a subject"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className={buttonClasses}
                  >
                    <FaPlus className="-ml-0.5 mr-1.5 h-3 w-3" />
                    Add Subject
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.currentSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeFromArray('currentSubjects', index)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove {subject}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Target Exams */}
              <div className="col-span-full">
                <label className={labelClasses}>Target Exams</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={newExam}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddExam()}
                    onChange={(e) => setNewExam(e.target.value)}
                    className="flex-1 min-w-0 block w-full rounded-l-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add a target exam (e.g., JEE, NEET, UPSC)"
                  />
                  <button
                    type="button"
                    onClick={handleAddExam}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.targetExams.map((exam, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {exam}
                      <button
                        type="button"
                        onClick={() => removeFromArray('targetExams', index)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove {exam}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Additional Information
        return (
          <div className="space-y-6">
            <h2 className={sectionTitleClasses}>Additional Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className={labelClasses}>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className={inputClasses}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className={labelClasses}>Hobbies & Interests</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    value={newHobby}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddHobby()}
                    onChange={(e) => setNewHobby(e.target.value)}
                    className="flex-1 min-w-0 block w-full rounded-l-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Add a hobby or interest"
                  />
                  <button
                    type="button"
                    onClick={handleAddHobby}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {hobby}
                      <button
                        type="button"
                        onClick={() => removeFromArray('hobbies', index)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove {hobby}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClasses}>Profile Picture</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                    {form.profilePicture ? (
                      <img
                        src={URL.createObjectURL(form.profilePicture)}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <FaUser className="h-8 w-8" />
                      </div>
                    )}
                  </span>
                  <label className="ml-3">
                    <span className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      <FaImage className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                      Change
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Review & Submit
        return (
          <div className="space-y-8">
            <div>
              <h2 className={sectionTitleClasses}>Review Your Information</h2>
              <p className="text-gray-600">Please review your information before submitting.</p>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.dateOfBirth}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{form.gender}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div>{form.address.city}, {form.address.state}</div>
                    <div>{form.address.country}, {form.address.pincode}</div>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Education Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Education Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">School/College</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.schoolCollegeName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Class/Grade</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.classGrade}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stream</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{form.stream}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Board</dt>
                  <dd className="mt-1 text-sm text-gray-900">{form.board}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Current Subjects</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-2">
                      {form.currentSubjects.map((subject, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
                {form.targetExams.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Target Exams</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-2">
                        {form.targetExams.map((exam, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {exam}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                {form.learningGoals && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Learning Goals</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{form.learningGoals}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                {form.bio && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Bio</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{form.bio}</dd>
                  </div>
                )}
                {form.hobbies.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Hobbies & Interests</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <div className="flex flex-wrap gap-2">
                        {form.hobbies.map((hobby, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={form.agreeToTerms}
                    onChange={(e) => setForm({ ...form, agreeToTerms: e.target.checked })}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  const Stepper = ({ currentStep }: { currentStep: number }) => {
    return (
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Student Registration</h1>
        <div className="flex items-center justify-between max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {STEPS.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                    currentStep >= index 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`mt-3 text-sm font-medium ${
                  currentStep >= index ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-1.5 mx-2 ${
                  currentStep > index ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Stepper currentStep={currentStep} />

        <div className={cardClasses}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <svg
                    className="mr-2 -ml-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>
              ) : (
                <div />
              )}
              <button
                type={currentStep === STEPS.length - 1 ? "submit" : "button"}
                onClick={currentStep === STEPS.length - 1 ? undefined : nextStep}
                disabled={!isStepValid() || loading}
                className={`ml-auto inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  !isStepValid() || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : currentStep === STEPS.length - 1 ? (
                  'Complete Registration'
                ) : (
                  <>
                    Next
                    <svg
                      className="ml-2 -mr-1 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;