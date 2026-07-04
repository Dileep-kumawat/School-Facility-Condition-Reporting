import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/lib/utils';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, ClipboardList, PlusCircle, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const allIssues = await DB.getIssues();
  
  // Filter issues based on role: Parents see only their own, Teachers can see all school issues (schoolId matches)
  const isTeacher = user.role === 'teacher';
  const reporterIssues = allIssues.filter(i => i.createdBy === user.id);
  const schoolIssues = allIssues; // In simulated school, all issues belong to same school

  const activeIssues = isTeacher ? schoolIssues : reporterIssues;

  // Counts
  const totalCount = activeIssues.length;
  const pendingCount = activeIssues.filter(i => i.status === 'reported' || i.status === 'under_review').length;
  const progressCount = activeIssues.filter(i => i.status === 'assigned' || i.status === 'in_progress').length;
  const resolvedCount = activeIssues.filter(i => i.status === 'resolved' || i.status === 'closed').length;

  const recentIssues = [...activeIssues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-600/90 to-blue-500 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hello, {user.name.split(' ')[0]}!
          </h2>
          <p className="mt-2 text-xs md:text-sm text-blue-50 opacity-90 leading-relaxed">
            Welcome to the EduKeep portal. You can report infrastructure issues, upload photos, and track the progress of ongoing maintenance work in real-time.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 translate-y-6 opacity-15 hidden md:block">
          <ClipboardList className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/report"
          className="flex items-center justify-between p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
        >
          <div className="flex gap-4 items-center">
            <span className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-semibold text-sm">Report New Issue</h3>
              <p className="text-muted text-xs mt-0.5">Submit photos and details about a damaged classroom item, toilet leak, etc.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard/my-reports"
          className="flex items-center justify-between p-5 border border-border bg-card rounded-xl shadow-sm hover:shadow-md hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
        >
          <div className="flex gap-4 items-center">
            <span className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-semibold text-sm">
                {isTeacher ? 'View All Reports' : 'Track My Reports'}
              </h3>
              <p className="text-muted text-xs mt-0.5">Check status updates, technician logs, and completion timelines.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Stats Counter */}
      <div>
        <h3 className="text-xs font-bold tracking-wider uppercase text-muted mb-4">
          {isTeacher ? 'School Facility Overview' : 'My Submission Activity'}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Submissions', value: totalCount, icon: ClipboardList, color: 'text-primary bg-primary/10 border-primary/20' },
            { label: 'Pending Review', value: pendingCount, icon: AlertCircle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
            { label: 'In Progress', value: progressCount, icon: Wrench, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
            { label: 'Resolved / Closed', value: resolvedCount, icon: CheckCircle2, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted">{stat.label}</p>
                  <h4 className="text-2xl font-bold mt-1.5">{stat.value}</h4>
                </div>
                <span className={`p-2.5 rounded-lg border ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Issues List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
          <div>
            <CardTitle>Recent Facility Issues</CardTitle>
            <CardDescription>
              {isTeacher
                ? 'Latest reported facility conditions across the school campus.'
                : 'Timeline of the latest issues you submitted.'}
            </CardDescription>
          </div>
          <Link
            href="/dashboard/my-reports"
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent className="divide-y divide-border/50 p-0">
          {recentIssues.length === 0 ? (
            <div className="text-center py-12 text-muted text-sm">
              <AlertCircle className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
              <p>No issues reported yet.</p>
              <Link href="/dashboard/report" className="text-primary hover:underline text-xs mt-1 block">
                Submit your first report now
              </Link>
            </div>
          ) : (
            recentIssues.map((issue) => (
              <div key={issue.id} className="p-5 flex items-center justify-between hover:bg-muted-background/25 transition">
                <div className="flex gap-4 items-start min-w-0 pr-4">
                  {issue.images[0] ? (
                    <img
                      src={issue.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-muted-background shrink-0"
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-lg bg-muted-background flex items-center justify-center text-muted text-xs font-semibold shrink-0">
                      IMG
                    </span>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/reports/${issue.id}`}
                      className="font-semibold text-sm hover:text-primary transition truncate block"
                    >
                      {issue.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-muted">
                      <span>ID: {issue.id}</span>
                      <span>•</span>
                      <span>{issue.category}</span>
                      <span>•</span>
                      <span>{issue.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant="status" status={issue.status} />
                  <span className="text-[10px] text-muted-text/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(issue.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
