import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ReportDetailsClient from './ReportDetailsClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const issue = await DB.getIssue(id);
  if (!issue) {
    notFound();
  }

  // Ensure security: Parents see only their own issues, admins and teachers see all
  if (user.role === 'parent' && issue.createdBy !== user.id) {
    redirect('/dashboard');
  }

  const timelineEvents = await DB.getTimelines(id);

  // Split standard timeline events from comments
  const standardEvents = timelineEvents.filter(e => !e.action.startsWith('Comment:'));
  const comments = timelineEvents
    .filter(e => e.action.startsWith('Comment:'))
    .map(e => ({
      id: e.id,
      author: e.updatedBy,
      text: e.action.slice(10, -1), // strips `Comment: "` and `"`
      timestamp: e.timestamp,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // oldest comments first

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex items-center gap-3">
        <Link
          href={user.role === 'admin' ? '/admin/issues' : '/dashboard/my-reports'}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted-background transition text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] text-muted font-mono font-semibold uppercase tracking-wider">Report ID: {issue.id}</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground -mt-0.5">{issue.title}</h2>
        </div>
      </div>

      <ReportDetailsClient
        issue={issue}
        user={user}
        initialEvents={standardEvents}
        initialComments={comments}
      />
    </div>
  );
}
