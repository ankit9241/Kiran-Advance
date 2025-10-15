'use client';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorService } from '../../services/mentorService';
import { toast } from 'react-toastify';
import { MentorRequest } from '../../types/mentor';

interface Mentor {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  education: string[];
  bio: string;
  skills: string[];
  certifications: string[];
  availability: {
    schedule: string;
    timezone: string;
  };
  avatar: string;
  rating: number;
  totalSessions: number;
  subjects: string[];
  specializations: string[];
  achievements: string[];
  languages: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  isApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface MentorDirectoryProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  openDirectory?: boolean;
}

interface MentorDirectoryProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  openDirectory?: boolean;
}

export default function MentorDirectory({ user, openDirectory }: MentorDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showAskDoubtModal, setShowAskDoubtModal] = useState<{mentorId: string | null, open: boolean}>({mentorId: null, open: false});
  const [doubtText, setDoubtText] = useState('');

  useEffect(() => {
    if (openDirectory && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openDirectory]);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const mentorsData = await mentorService.getApprovedMentors();
        // Transform the data to match the expected format
        const formattedMentors = mentorsData.map((mentor: any) => ({
          ...mentor,
          id: mentor._id,
          avatar: mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`,
          subjects: Array.isArray(mentor.skills) ? mentor.skills : [],
          specializations: mentor.specialization ? [mentor.specialization] : [],
          rating: mentor.rating || 0,
          totalSessions: mentor.totalSessions || 0,
          achievements: mentor.achievements || [],
          languages: mentor.languages || [],
          availability: typeof mentor.availability === 'string' 
            ? { schedule: mentor.availability, timezone: 'UTC' }
            : mentor.availability || { schedule: 'Not specified', timezone: 'UTC' }
        } as Mentor));
        setMentors(formattedMentors);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load mentors';
        setError(errorMessage);
        toast.error('Failed to load mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Get unique subjects from all mentors
  const subjects = ['all', ...Array.from(new Set(mentors.flatMap(mentor => 
    mentor.subjects || []
  )))].filter(Boolean) as string[];

  const filteredMentors = mentors.filter((mentor) => {
    if (!mentor) return false;
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = mentor.name?.toLowerCase().includes(searchLower) || false;
    const specializationMatch = mentor.specialization?.toLowerCase().includes(searchLower) || false;
    const subjectMatch = selectedSubject === 'all' || 
      (mentor.subjects?.some(subject => 
        subject?.toLowerCase().includes(selectedSubject.toLowerCase())
      ) || false);
    
    return (nameMatch || specializationMatch) && subjectMatch;
  });

  const navigate = useNavigate();

  const handleContactMentor = (mentorId: string) => {
    navigate(`/student/chat/${mentorId}`);
  };

  const handleAskDoubt = (mentorId: string) => {
    setShowAskDoubtModal({mentorId, open: true});
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the doubt to the backend, associated with showAskDoubtModal.mentorId
    alert(`Doubt sent privately to mentor!`);
    setShowAskDoubtModal({mentorId: null, open: false});
    setDoubtText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mentor Directory</h1>
        <div className="text-sm text-gray-600">
          {filteredMentors.length} mentors available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search mentors by name, subject, or specialization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                ref={searchInputRef}
              />
              <div className="absolute left-3 top-2.5 w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSubject === subject
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{mentor.name}</h3>
                <p className="text-sm text-gray-600 truncate">{mentor.email}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`ri-star-${i < Math.floor(mentor.rating) ? 'fill' : 'line'} text-yellow-500 text-sm`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{mentor.rating} ({mentor.totalSessions} sessions)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Subjects</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Experience</h4>
                <p className="text-sm text-gray-600">{mentor.experience} in teaching and mentoring</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.specializations.slice(0, 3).map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                  {mentor.specializations.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{mentor.specializations.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">Availability</h4>
                <p className="text-xs text-gray-600">
                  {typeof mentor.availability === 'string' 
                    ? mentor.availability 
                    : mentor.availability?.schedule || 'Not specified'}
                </p>
                {mentor.availability?.timezone && (
                  <p className="text-xs text-gray-500">{mentor.availability.timezone}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedMentor(mentor.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                View Profile
              </button>
              <button
                onClick={() => handleAskDoubt(mentor.id)}
                className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Ask Doubt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Detail Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const mentor = mentors.find(m => m.id === selectedMentor);
              if (!mentor) return null;

              return (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gray-800">Mentor Profile</h2>
                      <button
                        onClick={() => setSelectedMentor(null)}
                        className="w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-start space-x-6">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{mentor.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center space-x-1">
                            <i className="ri-mail-line"></i>
                            <span>{mentor.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="ri-phone-line"></i>
                            <span>{mentor.phone}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`ri-star-${i < Math.floor(mentor.rating) ? 'fill' : 'line'} text-yellow-500`}
                              ></i>
                            ))}
                            <span className="text-gray-600 ml-2">{mentor.rating}/5.0</span>
                          </div>
                          <span className="text-gray-600">{mentor.totalSessions} sessions completed</span>
                          <span className="text-gray-600">{mentor.experience} experience</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">About</h4>
                      <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Education</h4>
                        <ul className="space-y-2">
                          {mentor.education.map((edu, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <i className="ri-graduation-cap-line text-blue-500 mt-1"></i>
                              <span className="text-gray-700 text-sm">{edu}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h4>
                        <ul className="space-y-2">
                          {mentor.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <i className="ri-trophy-line text-yellow-500 mt-1"></i>
                              <span className="text-gray-700 text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specializations.map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Availability</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Schedule:</span> {mentor.availability.schedule}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Timezone:</span> {mentor.availability.timezone}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {mentor.languages.map((language, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleContactMentor(mentor.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-mail-line mr-2"></i>
                        Contact Mentor
                      </button>
                      <button
                        onClick={() => handleAskDoubt(mentor.id)}
                        className="flex-1 border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-question-line mr-2"></i>
                        Ask Doubt
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {/* Ask Doubt Modal */}
      {showAskDoubtModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Ask a Doubt to Mentor</h2>
            <form onSubmit={handleSubmitDoubt} className="space-y-4">
              <textarea
                value={doubtText}
                onChange={e => setDoubtText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Type your doubt here..."
                required
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAskDoubtModal({mentorId: null, open: false})} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium cursor-pointer whitespace-nowrap">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">Send Doubt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-star-line text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No mentors found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}