export type UserRole = 'parent' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password
  role: UserRole;
  schoolId: string;
  avatar: string;
  createdAt: string;
}

export type IssueCategory =
  | 'Furniture'
  | 'Electrical'
  | 'Water Supply'
  | 'Toilets'
  | 'Sanitation'
  | 'Playground'
  | 'Building Damage'
  | 'Classroom'
  | 'Security'
  | 'Others';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus =
  | 'reported'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  location: string;
  building: string;
  room: string;
  status: IssueStatus;
  images: string[];
  videos: string[];
  createdBy: string; // User ID
  createdByName?: string; // Cache reporter name for displays
  createdByRole?: UserRole; // Cache reporter role
  assignedTo?: string; // Staff/technician name
  estimatedCompletion?: string; // ISO date string or date-only string
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  issueId: string;
  action: string; // e.g. "Issue reported", "Assigned to John Doe", "Status changed to In Progress"
  updatedBy: string; // Name of the user who took action
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
