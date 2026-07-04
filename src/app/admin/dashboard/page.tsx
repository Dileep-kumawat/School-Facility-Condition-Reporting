import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const issues = await DB.getIssues();
  const users = await DB.getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Admin Command Center</h2>
        <p className="text-xs text-muted mt-1 font-normal">Monitor infrastructure issues, track technician assignments, and review campus facility analytics.</p>
      </div>

      <AdminDashboardClient issues={issues} usersCount={users.length} />
    </div>
  );
}
