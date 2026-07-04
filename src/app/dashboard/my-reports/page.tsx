import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import MyReportsClient from './MyReportsClient';

export const dynamic = 'force-dynamic';

export default async function MyReportsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Parents see only their own, Teachers see school-wide (all)
  const allIssues = await DB.getIssues();
  const isTeacher = user.role === 'teacher';
  
  const issues = isTeacher 
    ? allIssues 
    : allIssues.filter((i) => i.createdBy === user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {isTeacher ? 'School Facility Reports' : 'My Reported Issues'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {isTeacher 
              ? 'Monitor, inspect, and track all infrastructure reports submitted by parents and teachers.' 
              : 'View, search, and track progress on all your submitted facility reports.'}
          </p>
        </div>
      </div>

      <MyReportsClient initialIssues={issues} />
    </div>
  );
}
