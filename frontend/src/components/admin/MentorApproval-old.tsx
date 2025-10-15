'use client';

import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { mentorService } from '../../services/mentorService';
import { toast } from 'react-hot-toast';
import type { MentorRequest as MentorRequestType, Education } from '../../types/mentor';

// Define types for tab data
interface TabData {
  id: 'all' | 'pending' | 'approved' | 'rejected';
  name: string;
  count: number;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface MentorApprovalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

interface MentorRequestProps {
  id?: string;
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  education?: string | Education[];
  bio?: string;
  skills?: string[];
  certifications?: string[];
  availability?: string;
  hourlyRate?: number;
  avatar?: string;
  documents?: {
    resume?: string;
    certificates?: string[];
  };
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  rejectedAt?: string;
}

// Mentor type is now the same as MentorRequestProps
type Mentor = MentorRequestProps;

export default function MentorApproval({ user }: MentorApprovalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorRequests, setMentorRequests] = useState<MentorRequestProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchMentorRequests = async () => {
      try {
        setLoading(true);
        const pendingMentors: MentorRequestProps[] = await mentorService.getPendingMentors();
        const approvedMentors: MentorRequestProps[] = await mentorService.getApprovedMentors();
        
        // Combine and format the data
        const allMentors: MentorRequestProps[] = [
          ...pendingMentors.map(m => ({
            ...m,
            status: 'pending' as const
          })),
          ...approvedMentors.map(m => ({
            ...m,
            status: 'approved' as const
          }))
        ];
        
        setMentorRequests(allMentors);
        updateStats(allMentors);
      } catch (error) {
        console.error('Error fetching mentor requests:', error);
        toast.error('Failed to load mentor requests');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorRequests();
  }, []);

  // Handle tab change
  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
    setActiveTab(tab);
  };

  // Update stats based on mentor requests
  const updateStats = (mentors: MentorRequestProps[]) => {
    const total = mentors.length;
    const pending = mentors.filter(m => m.status === 'pending').length;
    const approved = mentors.filter(m => m.status === 'approved').length;
    const rejected = mentors.filter(m => m.status === 'rejected').length;
    
    setStats({
      total,
      pending,
      approved,
      rejected
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredMentors = mentorRequests.filter((request) => {
    if (activeTab === 'all') return true;
    return request.status === activeTab;
  }).filter((request): request is MentorRequestProps & { status: string } => {
    // This type guard ensures we're working with valid MentorRequestProps
    return !!request._id && !!request.name && !!request.email;
  });

  const handleApprove = async (mentor: MentorRequestProps) => {
    const mentorId = mentor._id || mentor.id || '';
    if (!mentorId) {
      console.error('Cannot approve mentor: Invalid mentor ID');
      return;
    }
    
    try {
      await mentorService.approveMentor(mentorId);
      
      // Update local state
      const updatedMentors = mentorRequests.map(m => 
        m.id === mentor.id 
          ? { 
              ...m, 
              status: 'approved' as const,
              isApproved: true,
              approvedAt: new Date().toISOString(),
              approvedBy: user.id
            } 
          : m
      );
      
      setMentorRequests(updatedMentors);
      updateStats(updatedMentors);
      setSelectedMentor(null);
      
      // Send notification to mentor
      if (mentor.id && mentor.name && mentor.email) {
        await notificationService.notifyMentorApprovalStatus({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          approved: true
        });
      }
      
      toast.success('Mentor approved successfully');
    } catch (error) {
      console.error('Error approving mentor:', error);
      toast.error('Failed to approve mentor');
    }
  };

  const handleReject = async (mentor: MentorRequestProps) => {
    const mentorId = mentor._id || mentor.id || '';
    if (!mentorId) {
      console.error('Cannot reject mentor: Invalid mentor ID');
      return;
    }
    
    try {
      await mentorService.rejectMentor(mentorId, 'Rejected by admin');
      
      // Update local state
      const updatedMentors = mentorRequests.map(m => 
        m.id === mentor.id 
          ? { 
              ...m, 
              status: 'rejected' as const,
              rejectedAt: new Date().toISOString(),
              rejectedBy: user.id,
              rejectionReason: rejectionMessage 
            } 
          : m
      );
      
      setMentorRequests(updatedMentors);
      updateStats(updatedMentors);
      setSelectedMentor(null);
      setShowRejectionModal(false);
      setRejectionMessage('');
      
      // Send notification to mentor
      if (mentor.id && mentor.name && mentor.email) {
        await notificationService.notifyMentorApprovalStatus({
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          approved: false,
          reason: rejectionMessage || ''
        });
      }
      
      toast.success('Mentor rejected successfully');
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      toast.error('Failed to reject mentor');
    }
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs: TabData[] = [
    { id: 'all', name: 'All', count: stats.total },
    { id: 'pending', name: 'Pending', count: stats.pending },
    { id: 'approved', name: 'Approved', count: stats.approved },
    { id: 'rejected', name: 'Rejected', count: stats.rejected },
  ];

  // Render education information
  const renderEducation = (education: string | Education[] | undefined) => {
    if (!education) return <p>No education information provided</p>;
    
    // Handle case where education is a string
    if (typeof education === 'string') {
      return <p className="text-gray-700">{education}</p>;
    }
    
    return (
      <div className="space-y-2">
        {education.map((edu, index) => (
          <div key={index} className="border-l-2 border-gray-200 pl-3">
            <h4 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
            <p className="text-sm text-gray-600">{edu.institution}</p>
            <p className="text-xs text-gray-500">
              {edu.year}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Render skills as chips
  const renderSkills = (skills: string[] | undefined) => {
    if (!skills || skills.length === 0) {
      return <p className="text-gray-500 italic">No skills specified</p>;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  // Send notification to admin for new mentor request
  const notifyAdmin = async (mentor: MentorRequestProps) => {
    try {
      if (!mentor.id || !mentor.name || !mentor.email) {
        console.error('Missing required fields for notification');
        return;
      }
      await notificationService.notifyMentorApprovalStatus({
        id: mentor.id,
        name: mentor.name,
        email: mentor.email,
        approved: false
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Early return if no selectedMentor for modal rendering
  const renderMentorModal = () => {
    if (!selectedMentor || !showMentorModal) return null;
    
    // Safe destructuring with defaults
    const {
      avatar = '',
      name = 'No name provided',
      email = 'No email provided',
      phone = 'No phone provided',
      specialization = 'Not specified',
      experience = 'Not specified',
      hourlyRate = 0,
      status = 'pending',
      bio = 'No bio provided',
      education = [],
      skills = [],
      certifications = [],
      availability = 'Not specified',
      documents = { resume: '', certificates: [] }
    } = selectedMentor;
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = '/default-avatar.png';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Mentor Details</h3>
            <button 
              onClick={() => setSelectedMentor(null)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Close modal"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={avatar || '/default-avatar.png'}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover"
                  onError={handleImageError}
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
                  <p className="text-gray-600">{email}</p>
                  {phone && <p className="text-sm text-gray-500">{phone}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div><span className="font-medium">Specialization:</span> {specialization}</div>
                <div><span className="font-medium">Experience:</span> {experience}</div>
                {hourlyRate > 0 && (
                  <div><span className="font-medium">Hourly Rate:</span> ${hourlyRate}/hr</div>
                )}
              </div>
            </div>
            
            {/* Bio */}
            {bio && (
              <div>
                <h4 className="text-lg font-semibold mb-2">About</h4>
                <p className="text-gray-700">{bio}</p>
              </div>
            )}
            
            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Education</h4>
                <div className="space-y-4">
                  {renderEducation(education)}
                </div>
              </div>
            )}
            
            {/* Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {renderSkills(skills)}
                </div>
              </div>
            )}
            
            {/* Documents */}
            {documents && (documents.resume || (documents.certificates && documents.certificates.length > 0)) && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Documents</h4>
                <div className="space-y-2">
                  {documents.resume && (
                    <div>
                      <span className="font-medium">Resume: </span>
                      <a 
                        href={documents.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                  {documents.certificates && documents.certificates.length > 0 && (
                    <div>
                      <div className="font-medium mb-1">Certificates:</div>
                      <div className="space-y-1">
                        {documents.certificates.map((cert, index) => (
                          <div key={index}>
                            <a 
                              href={cert} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Certificate {index + 1}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            {status === 'pending' && (
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => handleApprove(selectedMentor)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectionModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reject Mentor Request</h3>
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
                <textarea
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for rejection..."
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (selectedMentor) {
                      await handleReject(selectedMentor);
                    }
                  }}
                  disabled={!rejectionMessage.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}