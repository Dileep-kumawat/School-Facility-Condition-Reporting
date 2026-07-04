import React from 'react';
import { cn } from '@/lib/utils';
import { IssuePriority, IssueStatus } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'status' | 'priority';
  status?: IssueStatus;
  priority?: IssuePriority;
  children?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  status,
  priority,
  children,
  ...props
}: BadgeProps) {
  let badgeStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';

  if (variant === 'default') {
    badgeStyles = cn(badgeStyles, 'bg-primary/10 text-primary border border-primary/20');
  } else if (variant === 'outline') {
    badgeStyles = cn(badgeStyles, 'border border-border text-foreground bg-transparent');
  } else if (variant === 'status' && status) {
    switch (status) {
      case 'reported':
        badgeStyles = cn(badgeStyles, 'bg-blue-500/10 text-blue-500 border border-blue-500/25 dark:bg-blue-500/20');
        children = children || 'Reported';
        break;
      case 'under_review':
        badgeStyles = cn(badgeStyles, 'bg-purple-500/10 text-purple-500 border border-purple-500/25 dark:bg-purple-500/20');
        children = children || 'Under Review';
        break;
      case 'assigned':
        badgeStyles = cn(badgeStyles, 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/25 dark:bg-cyan-500/20');
        children = children || 'Assigned';
        break;
      case 'in_progress':
        badgeStyles = cn(badgeStyles, 'bg-amber-500/10 text-amber-500 border border-amber-500/25 dark:bg-amber-500/20');
        children = children || 'In Progress';
        break;
      case 'resolved':
        badgeStyles = cn(badgeStyles, 'bg-green-500/10 text-green-500 border border-green-500/25 dark:bg-green-500/20');
        children = children || 'Resolved';
        break;
      case 'closed':
        badgeStyles = cn(badgeStyles, 'bg-gray-500/10 text-gray-500 border border-gray-500/25 dark:bg-gray-500/20');
        children = children || 'Closed';
        break;
    }
  } else if (variant === 'priority' && priority) {
    switch (priority) {
      case 'low':
        badgeStyles = cn(badgeStyles, 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/25');
        children = children || 'Low';
        break;
      case 'medium':
        badgeStyles = cn(badgeStyles, 'bg-blue-500/10 text-blue-500 border border-blue-500/25');
        children = children || 'Medium';
        break;
      case 'high':
        badgeStyles = cn(badgeStyles, 'bg-orange-500/10 text-orange-500 border border-orange-500/25');
        children = children || 'High';
        break;
      case 'critical':
        badgeStyles = cn(badgeStyles, 'bg-red-500/10 text-red-500 border border-red-500/25 animate-pulse');
        children = children || 'Critical';
        break;
    }
  }

  return (
    <span className={cn(badgeStyles, className)} {...props}>
      {children}
    </span>
  );
}
