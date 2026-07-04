'use client';

import React, { useState, useEffect } from 'react';
import { Issue } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FileText, Download, TrendingUp, Clock, Calendar, CheckCircle } from 'lucide-react';

interface AdminAnalyticsClientProps {
  issues: Issue[];
}

export default function AdminAnalyticsClient({ issues }: AdminAnalyticsClientProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Calculate resolution speeds and categories
  // Let's create realistic simulated resolution times (in days) per category
  const averageResolutionTimes = [
    { name: 'Electrical', days: 2.1, color: '#f59e0b' },
    { name: 'Toilets', days: 1.5, color: '#06b6d4' },
    { name: 'Furniture', days: 3.5, color: '#3b82f6' },
    { name: 'Playground', days: 4.8, color: '#10b981' },
    { name: 'Sanitation', days: 1.2, color: '#ec4899' },
    { name: 'Security', days: 0.8, color: '#ef4444' },
  ];

  // Monthly trends data
  const monthlyTrendsData = [
    { month: 'Apr', reported: 12, resolved: 8 },
    { month: 'May', reported: 18, resolved: 14 },
    { month: 'Jun', reported: 24, resolved: 21 },
    { month: 'Jul', reported: issues.length, resolved: issues.filter((i) => i.status === 'resolved' || i.status === 'closed').length },
  ];

  // Category counts for Pie Chart
  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryPieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#2563EB', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899', '#64748b'];

  // Simulated PDF export
  const handleExportPDF = () => {
    toast({
      title: 'Preparing PDF Report...',
      description: 'Assembling school facility status, analytics charts, and resolution metrics.',
      variant: 'info',
    });

    setTimeout(() => {
      window.print();
    }, 1500);
  };

  // REAL CSV Exporter
  const handleExportCSV = () => {
    try {
      toast({
        title: 'Generating CSV Data...',
        description: 'Compiling database rows into downloadable CSV schema.',
        variant: 'info',
      });

      // Define headers
      const headers = ['Issue ID', 'Title', 'Category', 'Priority', 'Location', 'Building', 'Room', 'Status', 'Technician', 'Created At'];
      
      // Map issues to csv row arrays
      const rows = issues.map((issue) => [
        issue.id,
        `"${issue.title.replace(/"/g, '""')}"`,
        issue.category,
        issue.priority,
        `"${issue.location.replace(/"/g, '""')}"`,
        issue.building,
        issue.room,
        issue.status,
        issue.assignedTo || 'Unassigned',
        issue.createdAt,
      ]);

      // Construct CSV content string
      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      // Create download blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `EduKeep_Facility_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'CSV Downloaded Successfully',
        description: 'Raw spreadsheet data has been saved to your device.',
        variant: 'success',
      });
    } catch (_error) {
      toast({
        title: 'CSV Generation Failed',
        description: 'Failed to serialize reports into CSV format.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Exporters and quick stats header */}
      <div className="flex flex-wrap gap-2.5 justify-between items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex gap-4 text-xs font-semibold text-muted-text">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span>Avg Resolution: <strong className="text-foreground">2.3 Days</strong></span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-border/70 pl-4">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Resolution Rate: <strong className="text-foreground">84%</strong></span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted-background text-xs font-semibold transition"
          >
            <FileText className="w-4 h-4 text-muted" />
            <span>Print Report</span>
          </button>
          
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition shadow-md shadow-primary/10"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Line Chart: Monthly submission vs resolution trends */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Monthly Reporting Trends</span>
              </CardTitle>
              <CardDescription>Comparison of reported vs resolved facility conditions over time.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="reported" name="Reported" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart: Average resolution time per category */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-5 h-5 text-primary" />
                <span>Avg Resolution Time (Days)</span>
              </CardTitle>
              <CardDescription>Average duration in days for maintenance staff to close facility repairs.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={averageResolutionTimes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar dataKey="days" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {averageResolutionTimes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart: Issue Category distribution */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Departmental Category Distribution</span>
              </CardTitle>
              <CardDescription>Breakdown of facility issues across campus maintenance departments.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="h-56 w-56 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-muted-text font-medium w-full">
                {categoryPieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 border border-border/50 rounded-lg p-2 bg-muted-background/25">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="truncate flex-1 font-semibold text-foreground">{item.name}</span>
                    <span className="text-[10px] text-muted font-bold shrink-0">{item.value} ({Math.round(item.value / issues.length * 100)}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
