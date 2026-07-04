'use client';

import React, { useState, useTransition } from 'react';
import { Issue, User, TimelineEvent, IssueStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Timeline } from '@/components/ui/Timeline';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { addCommentAction, updateIssueStatusAction, assignTechnicianAction } from '@/app/actions';
import { useToast } from '@/components/ui/Toast';
import { Calendar, Wrench, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface ReportDetailsClientProps {
  issue: Issue;
  user: User;
  initialEvents: TimelineEvent[];
  initialComments: Comment[];
}

export default function ReportDetailsClient({
  issue,
  user,
  initialEvents,
  initialComments,
}: ReportDetailsClientProps) {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [currentStatus, setCurrentStatus] = useState<IssueStatus>(issue.status);
  
  // Assignee states (for Admin use)
  const [technicianName, setTechnicianName] = useState(issue.assignedTo || '');
  const [estDate, setEstDate] = useState(
    issue.estimatedCompletion ? new Date(issue.estimatedCompletion).toISOString().split('T')[0] : ''
  );

  const [isPending, startTransition] = useTransition();
  const [isAssignPending, startAssignTransition] = useTransition();

  const isAdmin = user.role === 'admin';

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    startTransition(async () => {
      const res = await addCommentAction(issue.id, commentText);
      if (res.error) {
        toast({ title: 'Failed to add comment', description: res.error, variant: 'error' });
      } else {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          author: user.name,
          text: commentText,
          timestamp: new Date().toISOString(),
        };
        setComments((prev) => [...prev, newComment]);
        setCommentText('');
        toast({ title: 'Comment posted', variant: 'success' });
      }
    });
  };

  const handleUpdateStatus = (status: IssueStatus) => {
    startTransition(async () => {
      const res = await updateIssueStatusAction(issue.id, status);
      if (res.error) {
        toast({ title: 'Status Update Failed', description: res.error, variant: 'error' });
      } else {
        setCurrentStatus(status);
        
        // Append to mock local events for immediate feedback
        const newEvent: TimelineEvent = {
          id: Math.random().toString(36).substr(2, 9),
          issueId: issue.id,
          action: `Status updated to ${status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
          updatedBy: user.name,
          timestamp: new Date().toISOString(),
        };
        setEvents((prev) => [newEvent, ...prev]);

        toast({ title: 'Status updated successfully', variant: 'success' });
      }
    });
  };

  const handleAssignTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianName.trim() || !estDate) {
      toast({ title: 'Assignment Error', description: 'Provide name and date.', variant: 'error' });
      return;
    }

    startAssignTransition(async () => {
      const completionISO = new Date(estDate).toISOString();
      const res = await assignTechnicianAction(issue.id, technicianName, completionISO);
      if (res.error) {
        toast({ title: 'Assignment Failed', description: res.error, variant: 'error' });
      } else {
        setCurrentStatus('assigned');
        
        const newEvent: TimelineEvent = {
          id: Math.random().toString(36).substr(2, 9),
          issueId: issue.id,
          action: `Admin assigned repair task to ${technicianName}`,
          updatedBy: user.name,
          timestamp: new Date().toISOString(),
        };
        setEvents((prev) => [newEvent, ...prev]);

        toast({ title: 'Technician assigned successfully', variant: 'success' });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Details, Media, Comments */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Description Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle>Report Description</CardTitle>
            <CardDescription>Submitted by {issue.createdByName} ({issue.createdByRole}) • {formatDate(issue.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{issue.description}</p>
          </CardContent>
        </Card>

        {/* Media Attachments */}
        {(issue.images.length > 0 || issue.videos.length > 0) && (
          <Card>
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle>Attached Media Evidence</CardTitle>
              <CardDescription>Visual uploads associated with this report.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.images.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl border border-border overflow-hidden bg-black/5 aspect-video">
                    <img
                      src={img}
                      alt="Attachment evidence"
                      className="w-full h-full object-cover cursor-zoom-in transition hover:scale-105"
                      onClick={() => window.open(img, '_blank')}
                    />
                  </div>
                ))}
                {issue.videos.map((vid, idx) => (
                  <div key={idx} className="relative rounded-xl border border-border overflow-hidden bg-black/10 aspect-video flex items-center justify-center">
                    <video src={vid} controls className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collaborative Comments Section */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>Portal Discussion</span>
            </CardTitle>
            <CardDescription>Collaborative thread between staff, reporter, and school administration.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Conversation list */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-center text-muted text-xs py-8">No comments posted yet. Begin the conversation below.</p>
              ) : (
                comments.map((comment) => {
                  const isMe = comment.author === user.name;
                  return (
                    <div
                      key={comment.id}
                      className={`flex gap-3 text-xs ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 font-bold uppercase">
                        {comment.author.charAt(0)}
                      </div>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${
                        isMe 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-muted-background border border-border rounded-tl-none text-foreground'
                      }`}>
                        <div className="flex justify-between items-baseline gap-4 mb-1 select-none">
                          <span className="font-bold truncate">{comment.author}</span>
                          <span className={`text-[9px] opacity-75 ${isMe ? 'text-blue-100' : 'text-muted-text'}`}>
                            {formatTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 border-t border-border/60 pt-4">
              <input
                type="text"
                placeholder="Type a response or request clarification..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isPending}
                className="flex-1 h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <button
                type="submit"
                disabled={isPending || !commentText.trim()}
                className="h-11 w-11 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Status info, technician assignment, timeline */}
      <div className="space-y-6">
        
        {/* Core Metadata Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle>Report Status</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Workflow Status</span>
              <Badge variant="status" status={currentStatus} />
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Priority Tier</span>
              <Badge variant="priority" priority={issue.priority} />
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Category</span>
              <span className="font-semibold text-foreground">{issue.category}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted font-medium">Building</span>
              <span className="font-semibold text-foreground">{issue.building}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Room/Zone</span>
              <span className="font-semibold text-foreground">{issue.room}</span>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Technician Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-primary" />
              <span>Assigned Technician</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 text-xs space-y-3">
            {issue.assignedTo ? (
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-muted">Staff Name</span>
                  <span className="font-semibold text-foreground">{issue.assignedTo}</span>
                </div>
                {issue.estimatedCompletion && (
                  <div className="flex justify-between items-center bg-primary/5 border border-primary/15 rounded-lg p-2 mt-1">
                    <span className="text-primary flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target Date</span>
                    </span>
                    <span className="font-bold text-primary">
                      {new Date(issue.estimatedCompletion).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-2 text-muted italic">
                No technician has been assigned yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Controls */}
        {isAdmin && (
          <Card className="border-primary/25 bg-primary/[0.01]">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm">Admin Controls</CardTitle>
              <CardDescription>Assign repairs and manipulate workflow status.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Technician Assignment Form */}
              <form onSubmit={handleAssignTechnician} className="space-y-3 border-b border-border/60 pb-4">
                <p className="text-[10px] font-bold tracking-wider uppercase text-muted">Assign Maintenance Staff</p>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Higgins (Handyman)"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    disabled={isAssignPending}
                    className="w-full h-9 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={estDate}
                    onChange={(e) => setEstDate(e.target.value)}
                    disabled={isAssignPending}
                    className="flex-1 h-9 px-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
                  />
                  <button
                    type="submit"
                    disabled={isAssignPending}
                    className="h-9 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition disabled:opacity-50 shrink-0"
                  >
                    Assign
                  </button>
                </div>
              </form>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-wider uppercase text-muted">Transition Status</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { s: 'under_review', label: 'In Review' },
                    { s: 'in_progress', label: 'In Progress' },
                    { s: 'resolved', label: 'Resolved' },
                    { s: 'closed', label: 'Close Ticket' },
                  ].map((btn) => (
                    <button
                      key={btn.s}
                      type="button"
                      onClick={() => handleUpdateStatus(btn.s as IssueStatus)}
                      disabled={isPending || currentStatus === btn.s}
                      className={`h-9 px-2 rounded-lg border text-xs font-semibold transition ${
                        currentStatus === btn.s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card hover:bg-muted-background text-foreground/80'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reporter Action Button (e.g. Closing resolved tickets) */}
        {!isAdmin && currentStatus === 'resolved' && (
          <button
            onClick={() => handleUpdateStatus('closed')}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition shadow-md shadow-green-600/10"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Resolved & Close Report</span>
          </button>
        )}

        {/* Vertical Investigation Timeline */}
        <Card>
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm">Investigation Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <Timeline events={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
