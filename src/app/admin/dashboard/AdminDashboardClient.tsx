'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ClipboardList,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardClientProps {
  issues: Issue[];
  usersCount: number;
}

export default function AdminDashboardClient({ issues, usersCount }: AdminDashboardClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Calculate metrics
  const totalCount = issues.length;
  const unassignedCount = issues.filter((i) => i.status === 'reported' || i.status === 'under_review').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress' || i.status === 'assigned').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length;

  // Chart data: Priority Distribution
  const priorityDistribution = [
    { name: 'Critical', value: issues.filter((i) => i.priority === 'critical').length, color: '#DC2626' },
    { name: 'High', value: issues.filter((i) => i.priority === 'high').length, color: '#F59E0B' },
    { name: 'Medium', value: issues.filter((i) => i.priority === 'medium').length, color: '#2563EB' },
    { name: 'Low', value: issues.filter((i) => i.priority === 'low').length, color: '#64748B' },
  ];

  // Chart data: Category breakdown
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryBreakdownData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  // Recent Critical/High Priority issues list
  const priorityIssues = [...issues]
    .filter((i) => i.priority === 'critical' || i.priority === 'high')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Reports', value: totalCount, icon: ClipboardList, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Awaiting Action', value: unassignedCount, icon: AlertTriangle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
          { label: 'Active Repairs', value: inProgressCount, icon: Wrench, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
          { label: 'Resolved Cases', value: resolvedCount, icon: CheckCircle2, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
          { label: 'Enrolled Users', value: usersCount, icon: Users, color: 'text-purple-500 bg-purple-500/10' },
        ].map((metric, i) => (
          <Card key={i} className={i === 4 ? 'col-span-2 lg:col-span-1' : ''}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">{metric.label}</p>
                <h4 className="text-2xl font-bold mt-1.5">{metric.value}</h4>
              </div>
              <span className={`p-2.5 rounded-lg border border-border/40 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category breakdown bar chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Volume of reported facility condition tickets per department.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {categoryBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#2563EB' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority distribution pie chart */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle>Priority Breakdown</CardTitle>
              <CardDescription>Visual distribution of ticket severity levels.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityDistribution.filter((p) => p.value > 0)}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend List */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4 text-[10px] font-semibold text-muted">
                {priorityDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Action Items & Recent Logs */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>Action Required: Urgent Facility Reports</span>
              </CardTitle>
              <CardDescription>Critical and High severity issues awaiting review or technician assignment.</CardDescription>
            </div>
            <Link
              href="/admin/issues"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 group"
            >
              <span>Manage all issues</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border/50 p-0">
            {priorityIssues.length === 0 ? (
              <div className="text-center py-12 text-muted text-xs">
                No active critical or high priority reports in the system. Excellent work!
              </div>
            ) : (
              priorityIssues.map((issue) => (
                <div key={issue.id} className="p-4 flex items-center justify-between hover:bg-muted-background/25 transition">
                  <div className="flex gap-4 items-center min-w-0 pr-4">
                    <span className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <Link href={`/dashboard/reports/${issue.id}`} className="font-bold text-sm hover:text-primary transition truncate block">
                        {issue.title}
                      </Link>
                      <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-1 text-xs text-muted">
                        <span>Report ID: {issue.id}</span>
                        <span>•</span>
                        <span>{issue.category}</span>
                        <span>•</span>
                        <span>{issue.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="priority" priority={issue.priority} />
                    <span className="text-[9px] text-muted font-medium">{formatDate(issue.createdAt).split(',')[0]}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
