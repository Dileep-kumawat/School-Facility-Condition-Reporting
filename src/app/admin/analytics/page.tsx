import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminAnalyticsClient from './AdminAnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const issues = await DB.getIssues();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">System Performance & Analytics</h2>
          <p className="text-xs text-muted mt-1 font-normal">Inspect metrics on school facility tickets, resolution speeds, and category breakouts.</p>
        </div>
      </div>

      <AdminAnalyticsClient issues={issues} />
    </div>
  );
}
