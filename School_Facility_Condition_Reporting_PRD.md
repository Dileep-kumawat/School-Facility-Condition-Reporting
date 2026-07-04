# School Facility Condition Reporting & Repair Tracking Portal

On this page

Detailed guide and project requirements for the School Facility Condition Reporting & Repair Tracking Portal analysis.


## Context

Many schools face infrastructure issues such as broken furniture, unsafe classrooms,damaged toilets, poor sanitation, and electrical hazards. These problems often go unreported or unresolved due to lack of a structured reporting system.

Key challenges include:

- No centralized system to report facility issues
- Delayed response and repair tracking
- Lack of transparency in issue resolution
- Limited communication between parents, teachers, and administration

### The School Facility Condition Reporting & Repair Tracking Portal aims to

- Provide a digital platform for reporting infrastructure issues
- Enable tracking of repair status in real time
- Improve accountability and transparency
- Ensure safe and well-maintained school environments

## Problem Statement

- Poor visibility of school infrastructure issues
- Delayed maintenance and repairs
- Lack of accountability in issue resolution
- Inefficient communication among stakeholders

## Primary Objectives

- Enable easy reporting of facility issues
- Track repair progress and status
- Improve transparency and accountability
- Ensure timely maintenance actions
- Enhance student safety

## Secondary Objectives

- Encourage parent and teacher participation
- Improve school infrastructure quality
- Digitize maintenance management
- Support better governance

## Scope of the Product


### In Scope (Phase 1)

- User registration and login
- Issue reporting system
- Repair tracking dashboard
- Notification system
- Admin management panel

### Out of Scope (Phase 1)

- Integration with government maintenance systems
- Automated repair scheduling
- Mobile application version
- AI-based issue detection

## Functional Requirements


### User Module (Parents/Teachers)

- User registration & login
- Report infrastructure issues
- Upload images of problems
- Track issue status
- Receive updates

### Issue Reporting Module

- Submit issue details (description, category)
- Upload photos/videos
- Select location within school
- Assign priority level

### Repair Tracking Module

- View status (Pending, In Progress, Resolved)
- Timeline of actions taken
- Estimated resolution time
- Status updates and notifications

### Notification Module

- Alerts for status updates
- Notifications for resolved issues
- Reminders for pending repairs

### Dashboard Module

- Overview of reported issues
- Categorized issue tracking
- Priority-based filtering
- Summary statistics

### Admin/School Management Module

- View and manage reported issues
- Assign repair tasks
- Update status
- Monitor performance
- Generate reports

## Non-Functional Requirements

- Secure authentication system
- Responsive and mobile-friendly UI
- Fast and reliable performance
- Scalable backend architecture
- Data privacy and security

## Technology Stack (Suggested)


### Frontend

- Next.js
- Tailwind CSS

### Backend

- Next.js API routes and server actions

### Database

- MongoDB

### Media Storage

- Cloud storage for images - imageKit

### Deployment

- Vercel

## User Flow


### Parent/Teacher Flow

- Register/Login
- Report issue
- Upload images
- Track status
- Receive updates

### Admin Flow

- View reported issues
- Assign tasks
- Update status
- Monitor progress

## Data Requirements


### User Data

- Name
- Role (Parent/Teacher/Admin)
- School ID

### Issue Data

- Issue ID
- Description
- Category
- Location
- Status

### Repair Data

- Assigned staff
- Status updates
- Resolution timeline

## Key Performance Indicators (KPIs)

- Number of issues reported
- Average resolution time
- Percentage of resolved issues
- User engagement rate
- Satisfaction level

## Assumptions & Constraints


### Assumptions

- Parents and teachers will actively report issues
- Schools are willing to adopt digital systems
- Internet access is available

### Constraints

- Resistance to adoption in some schools
- Delay in manual repair processes
- Data accuracy depends on user input

## Deliverables

- Fully functional Reporting Platform
- Issue reporting and tracking system
- Notification and dashboard modules
- Admin panel
- Live deployed application link
- Complete PRD document

## Expected Impact

- Improved school infrastructure
- Faster issue resolution
- Increased transparency
- Better student safety
- Enhanced community participation

## Project Guidelines & Implementation Notes

- The project must include 6–8 interconnected pages (Login, Dashboard, Issue Reporting Page, Tracking Page, Notifications Page, Admin Panel).
- Ensure reporting and tracking system works accurately.
- Use realistic school-related data.
- Implement proper validation and secure authentication.
- The application must be fully tested before submission.
- Only a live deployed link will be accepted for final evaluation.