'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../../services/notificationService';
import { mentorService } from '../../services/mentorService';
import { toast } from 'react-hot-toast';
import type { MentorRequest as MentorRequestType, Education } from '../../types/mentor';

// Types and Interfaces
interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface TabData {
  id: 'all' | 'pending' | 'approved' | 'rejected';
  name: string;
  count: number;
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

interface Mentor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  education?: string | Education[];
  bio?: string;
  expertise?: string[];
  skills?: string[];
  certifications?: string[];
  availability?: string;
  hourlyRate?: number;
  avatar?: string;
  linkedInProfile?: string;
  documents?: {
    resume?: string;
    certificates?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  rejectedAt?: string;
}

const MentorApproval: React.FC<MentorApprovalProps> = ({ user }) => {
  // State
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorRequests, setMentorRequests] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Filter mentors based on active tab
  const filteredMentors = mentorRequests.filter(mentor => 
    activeTab === 'all' || mentor.status === activeTab
  );

  // Fetch mentor requests
  const fetchMentorRequests = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingMentors, approvedMentors] = await Promise.all([
        mentorService.getPendingMentors(),
        mentorService.getApprovedMentors()
      ]);

      // Combine and format the data
      const allMentors: Mentor[] = [
        ...pendingMentors.map(m => ({ ...m, status: 'pending' as const })),
        ...approvedMentors.map(m => ({ ...m, status: 'approved' as const }))
      ];

      setMentorRequests(allMentors);
      updateStats(allMentors);
    } catch (error) {
      console.error('Error fetching mentor requests:', error);
      toast.error('Failed to load mentor requests');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update stats based on mentor data
  const updateStats = (mentors: Mentor[]) => {
    const pending = mentors.filter(m => m.status === 'pending').length;
    const approved = mentors.filter(m => m.status === 'approved').length;
    const rejected = mentors.filter(m => m.status === 'rejected').length;
    
    setStats({
      total: mentors.length,
      pending,
      approved,
      rejected
    });
  };

  // Handle tab change
  const handleTabChange = (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
    setActiveTab(tab);
  };

  // Handle mentor approval
  const handleApproveMentor = async (mentorId: string) => {
    try {
      await mentorService.approveMentor(mentorId);
      await fetchMentorRequests();
      toast.success('Mentor approved successfully');
    } catch (error) {
      console.error('Error approving mentor:', error);
      toast.error('Failed to approve mentor');
    }
  };

  // Handle mentor rejection
  const handleRejectMentor = async (mentorId: string, reason: string) => {
    try {
      await mentorService.rejectMentor(mentorId, reason);
      setShowRejectionModal(false);
      setRejectionMessage('');
      await fetchMentorRequests();
      toast.success('Mentor request rejected');
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      toast.error('Failed to reject mentor');
    }
  };

  // Initialize component
  useEffect(() => {
    fetchMentorRequests();
  }, [fetchMentorRequests]);

  // Tab data
  const tabs: TabData[] = [
    { id: 'all', name: 'All', count: stats.total },
    { id: 'pending', name: 'Pending', count: stats.pending },
    { id: 'approved', name: 'Approved', count: stats.approved },
    { id: 'rejected', name: 'Rejected', count: stats.rejected },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentor Approvals</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`p-4 rounded-lg shadow ${
              activeTab === tab.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
            }`}
          >
            <h3 className="text-sm font-medium text-gray-500">{tab.name}</h3>
            <p className="text-2xl font-semibold">{tab.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Mentor List */}
      <div className="space-y-4">
        {filteredMentors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {activeTab === 'all' ? '' : activeTab} mentors found
          </div>
        ) : (
          filteredMentors.map(mentor => (
            <div key={mentor._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{mentor.name}</h3>
                  <p className="text-gray-600">{mentor.email}</p>
                  {mentor.specialization && (
                    <p className="text-sm text-gray-500 mt-1">
                      Specialization: {mentor.specialization}
                    </p>
                  )}
                  {mentor.status === 'rejected' && mentor.rejectionReason && (
                    <p className="text-sm text-red-500 mt-1">
                      Reason: {mentor.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {mentor.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveMentor(mentor._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMentor(mentor);
                          setShowRejectionModal(true);
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setShowMentorModal(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Mentor Request</h3>
            <p className="mb-4">Enter the reason for rejecting {selectedMentor.name}'s request:</p>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              className="w-full border rounded p-2 mb-4 h-24"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectMentor(selectedMentor._id, rejectionMessage)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={!rejectionMessage.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Details Modal */}
      {showMentorModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Mentor Details</h3>
              <button
                onClick={() => setShowMentorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedMentor.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedMentor.email}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      selectedMentor.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedMentor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedMentor.status.charAt(0).toUpperCase() + selectedMentor.status.slice(1)}
                    </span>
                  </p>
                  {selectedMentor.phone && (
                    <p><span className="font-medium">Phone:</span> {selectedMentor.phone}</p>
                  )}
                </div>

                {selectedMentor.specialization && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Specialization</h4>
                    <p>{selectedMentor.specialization}</p>
                  </div>
                )}

                {selectedMentor.bio && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Bio</h4>
                    <p className="whitespace-pre-line">{selectedMentor.bio}</p>
                  </div>
                )}
              </div>

              <div>
                {selectedMentor.experience && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Experience</h4>
                    <p className="whitespace-pre-line">{selectedMentor.experience}</p>
                  </div>
                )}

                {selectedMentor.expertise && selectedMentor.expertise.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.expertise.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMentor.linkedInProfile && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">LinkedIn Profile</h4>
                    <a 
                      href={selectedMentor.linkedInProfile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {selectedMentor.status === 'pending' && (
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => handleApproveMentor(selectedMentor._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve Mentor
                </button>
                <button
                  onClick={() => {
                    setShowMentorModal(false);
                    setShowRejectionModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorApproval;
