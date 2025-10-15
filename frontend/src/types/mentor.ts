// Mentor-related TypeScript type definitions

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Availability {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface MentorProfile {
  _id: string;
  registrationId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  specialization?: string;
  expertise?: string[];
  skills?: string[];
  experience?: string | Experience[];
  education?: string | Education[];
  certifications?: string[] | Certification[];
  linkedInProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  hourlyRate?: number;
  availability?: string | Availability[];
  languages?: string[];
  timezone?: string;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorRequest extends MentorProfile {
  documents?: {
    resume?: string;
    certificates?: string[];
    idProof?: string;
  };
  adminNotes?: string;
  applicationStatus?: 'submitted' | 'under_review' | 'approved' | 'rejected';
}

export interface MentorStats {
  totalStudents: number;
  activeStudents: number;
  completedSessions: number;
  pendingSessions: number;
  rating: number;
  reviews: number;
  materialsUploaded: number;
  doubtsAnswered: number;
}

export interface MentorDashboardData {
  profile: MentorProfile;
  stats: MentorStats;
  recentStudents: any[];
  upcomingSessions: any[];
  pendingDoubts: any[];
  recentMaterials: any[];
}

export interface MentorSearchFilters {
  specialization?: string[];
  skills?: string[];
  experience?: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  availability?: string[];
  rating?: number;
  languages?: string[];
}

export interface MentorSearchResult {
  mentors: MentorProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MentorReview {
  _id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorAvailabilitySlot {
  _id?: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  timezone: string;
  isActive: boolean;
}

export interface MentorDocument {
  _id?: string;
  type: 'resume' | 'certificate' | 'id_proof' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface MentorApprovalAction {
  action: 'approve' | 'reject';
  mentorId: string;
  reason?: string;
  adminId: string;
  adminName: string;
  timestamp: string;
}

// Form data interfaces
export interface MentorRegistrationForm {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar?: File;
  };
  professionalInfo: {
    specialization: string;
    expertise: string[];
    skills: string[];
    experience: Experience[];
    education: Education[];
    certifications: Certification[];
  };
  profileLinks: {
    linkedInProfile?: string;
    githubProfile?: string;
    portfolioUrl?: string;
  };
  availability: {
    slots: MentorAvailabilitySlot[];
    timezone: string;
    hourlyRate?: number;
  };
  documents: {
    resume?: File;
    certificates?: File[];
    idProof?: File;
  };
}

export interface MentorUpdateForm extends Partial<MentorRegistrationForm> {
  _id: string;
}

// API response interfaces
export interface MentorApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MentorsListResponse extends MentorApiResponse<MentorProfile[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MentorDetailResponse extends MentorApiResponse<MentorProfile> {}

export interface MentorStatsResponse extends MentorApiResponse<MentorStats> {}

export interface MentorDashboardResponse extends MentorApiResponse<MentorDashboardData> {}