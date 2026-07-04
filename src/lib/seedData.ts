import { User, Issue, TimelineEvent, Notification } from '@/types';
import bcrypt from 'bcryptjs';

export async function getSeedData() {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const teacherPassword = await bcrypt.hash('teacher123', salt);
  const parentPassword = await bcrypt.hash('parent123', salt);

  const users: User[] = [
    {
      id: 'usr_admin1',
      name: 'Principal Sarah Jenkins',
      email: 'admin@school.com',
      password: adminPassword,
      role: 'admin',
      schoolId: 'SCH-88291',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 'usr_teacher1',
      name: 'Mr. David Miller',
      email: 'teacher@school.com',
      password: teacherPassword,
      role: 'teacher',
      schoolId: 'SCH-88291',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date('2026-02-15T09:30:00Z').toISOString(),
    },
    {
      id: 'usr_parent1',
      name: 'Elena Rostova',
      email: 'parent@school.com',
      password: parentPassword,
      role: 'parent',
      schoolId: 'SCH-88291',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      createdAt: new Date('2026-03-01T14:15:00Z').toISOString(),
    },
  ];

  const issues: Issue[] = [
    {
      id: 'iss_001',
      title: 'Water leakage in Block B Girls restroom',
      description: 'Major leak in the second cubicle pipe. Water is pooling on the floor, creating a slipping hazard for students.',
      category: 'Toilets',
      priority: 'critical',
      location: 'Block B, 1st Floor',
      building: 'Block B',
      room: 'Restroom G1',
      status: 'in_progress',
      images: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
      ],
      videos: [],
      createdBy: 'usr_teacher1',
      createdByName: 'Mr. David Miller',
      createdByRole: 'teacher',
      assignedTo: 'Robert Chen (Plumber)',
      estimatedCompletion: '2026-07-06T17:00:00Z',
      createdAt: new Date('2026-07-03T10:00:00Z').toISOString(),
    },
    {
      id: 'iss_002',
      title: 'Broken ceiling fan in Grade 5-A',
      description: 'The ceiling fan in the rear corner of Grade 5-A class is making loud sparks and has stopped spinning. Needs urgent replacement as it is summer.',
      category: 'Electrical',
      priority: 'high',
      location: 'Main Block, 2nd Floor',
      building: 'Main Block',
      room: 'Room 205',
      status: 'assigned',
      images: [
        'https://images.unsplash.com/photo-1618944847828-82e943c3dba7?w=800&auto=format&fit=crop',
      ],
      videos: [],
      createdBy: 'usr_parent1',
      createdByName: 'Elena Rostova',
      createdByRole: 'parent',
      assignedTo: 'Marcus Vance (Electrician)',
      estimatedCompletion: '2026-07-08T12:00:00Z',
      createdAt: new Date('2026-07-04T08:30:00Z').toISOString(),
    },
    {
      id: 'iss_003',
      title: 'Cracked stairs on playground entrance',
      description: 'The concrete step leading to the primary school playground is cracked and crumbling. It poses a tripping hazard.',
      category: 'Building Damage',
      priority: 'medium',
      location: 'Playground Access',
      building: 'Outdoor',
      room: 'Staircase East',
      status: 'under_review',
      images: [
        'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop',
      ],
      videos: [],
      createdBy: 'usr_parent1',
      createdByName: 'Elena Rostova',
      createdByRole: 'parent',
      createdAt: new Date('2026-07-04T12:00:00Z').toISOString(),
    },
    {
      id: 'iss_004',
      title: 'Broken swing seat on playground',
      description: 'One of the swing chain connectors snapped. The swing seat is hanging loose and is unusable.',
      category: 'Playground',
      priority: 'low',
      location: 'Primary Playground',
      building: 'Outdoor',
      room: 'Playground Area',
      status: 'resolved',
      images: [
        'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop',
      ],
      videos: [],
      createdBy: 'usr_teacher1',
      createdByName: 'Mr. David Miller',
      createdByRole: 'teacher',
      assignedTo: 'Joe Higgins (Handyman)',
      createdAt: new Date('2026-07-01T15:00:00Z').toISOString(),
    },
  ];

  const timelines: TimelineEvent[] = [
    {
      id: 'tm_001',
      issueId: 'iss_001',
      action: 'Issue reported by Mr. David Miller',
      updatedBy: 'Mr. David Miller',
      timestamp: new Date('2026-07-03T10:00:00Z').toISOString(),
    },
    {
      id: 'tm_002',
      issueId: 'iss_001',
      action: 'Admin marked issue status as Under Review',
      updatedBy: 'Principal Sarah Jenkins',
      timestamp: new Date('2026-07-03T11:15:00Z').toISOString(),
    },
    {
      id: 'tm_003',
      issueId: 'iss_001',
      action: 'Admin assigned repair task to Robert Chen (Plumber)',
      updatedBy: 'Principal Sarah Jenkins',
      timestamp: new Date('2026-07-03T14:30:00Z').toISOString(),
    },
    {
      id: 'tm_004',
      issueId: 'iss_001',
      action: 'Technician started working on the pipeline',
      updatedBy: 'Robert Chen (Plumber)',
      timestamp: new Date('2026-07-04T09:00:00Z').toISOString(),
    },
    // Issue 002 Timelines
    {
      id: 'tm_005',
      issueId: 'iss_002',
      action: 'Issue reported by Elena Rostova',
      updatedBy: 'Elena Rostova',
      timestamp: new Date('2026-07-04T08:30:00Z').toISOString(),
    },
    {
      id: 'tm_006',
      issueId: 'iss_002',
      action: 'Admin assigned repair task to Marcus Vance (Electrician)',
      updatedBy: 'Principal Sarah Jenkins',
      timestamp: new Date('2026-07-04T15:00:00Z').toISOString(),
    },
    // Issue 003 Timelines
    {
      id: 'tm_007',
      issueId: 'iss_003',
      action: 'Issue reported by Elena Rostova',
      updatedBy: 'Elena Rostova',
      timestamp: new Date('2026-07-04T12:00:00Z').toISOString(),
    },
    // Issue 004 Timelines
    {
      id: 'tm_008',
      issueId: 'iss_004',
      action: 'Issue reported by Mr. David Miller',
      updatedBy: 'Mr. David Miller',
      timestamp: new Date('2026-07-01T15:00:00Z').toISOString(),
    },
    {
      id: 'tm_009',
      issueId: 'iss_004',
      action: 'Admin assigned Joe Higgins (Handyman)',
      updatedBy: 'Principal Sarah Jenkins',
      timestamp: new Date('2026-07-02T09:00:00Z').toISOString(),
    },
    {
      id: 'tm_010',
      issueId: 'iss_004',
      action: 'Handyman marked issue as Resolved (replaced swing chains)',
      updatedBy: 'Joe Higgins (Handyman)',
      timestamp: new Date('2026-07-03T16:00:00Z').toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'not_001',
      userId: 'usr_teacher1',
      title: 'Plumbing Issue In Progress',
      message: 'The reported toilet leakage issue (iss_001) has been updated to "In Progress" by Robert Chen (Plumber).',
      read: false,
      createdAt: new Date('2026-07-04T09:05:00Z').toISOString(),
    },
    {
      id: 'not_002',
      userId: 'usr_parent1',
      title: 'Fan Replacement Assigned',
      message: 'Your reported ceiling fan issue (iss_002) has been assigned to Marcus Vance (Electrician).',
      read: false,
      createdAt: new Date('2026-07-04T15:01:00Z').toISOString(),
    },
    {
      id: 'not_003',
      userId: 'usr_teacher1',
      title: 'Swing Repaired Successfully',
      message: 'The broken swing seat issue (iss_004) you reported has been marked as RESOLVED.',
      read: true,
      createdAt: new Date('2026-07-03T16:05:00Z').toISOString(),
    },
  ];

  return { users, issues, timelines, notifications };
}
