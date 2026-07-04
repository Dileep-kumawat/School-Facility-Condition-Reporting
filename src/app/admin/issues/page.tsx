import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminIssuesClient from './AdminIssuesClient';

export const dynamic = 'force-dynamic';

export default async function AdminIssuesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const issues = await DB.getIssues();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Facility Issue Management</h2>
        <p className="text-xs text-muted mt-1 font-normal">Search, inspect, and route repair tickets. Assign technicians, update progress timelines, and close resolved tickets.</p>
      </div>

      <AdminIssuesClient initialIssues={issues} />
    </div>
  );
}
