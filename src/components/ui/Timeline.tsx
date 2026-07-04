import React from 'react';
import { TimelineEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, MessageSquare, ShieldAlert, Wrench } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-muted text-sm">
        No progress events recorded yet.
      </div>
    );
  }

  // Get matching icon based on the action keywords
  const getEventIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('report') || act.includes('create')) {
      return <ShieldAlert className="w-4 h-4 text-blue-500" />;
    }
    if (act.includes('assign')) {
      return <Wrench className="w-4 h-4 text-cyan-500" />;
    }
    if (act.includes('progress') || act.includes('start')) {
      return <Clock className="w-4 h-4 text-amber-500" />;
    }
    if (act.includes('resolve') || act.includes('complete')) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (act.includes('comment') || act.includes('note')) {
      return <MessageSquare className="w-4 h-4 text-slate-500" />;
    }
    return <Circle className="w-3.5 h-3.5 text-muted" />;
  };

  const getEventColorClass = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('report') || act.includes('create')) return 'bg-blue-500/10 border-blue-500/30';
    if (act.includes('assign')) return 'bg-cyan-500/10 border-cyan-500/30';
    if (act.includes('progress') || act.includes('start')) return 'bg-amber-500/10 border-amber-500/30';
    if (act.includes('resolve') || act.includes('complete')) return 'bg-green-500/10 border-green-500/30';
    return 'bg-muted-background border-border';
  };

  return (
    <div className={`relative border-l-2 border-border ml-3 pl-6 space-y-8 ${className}`}>
      {events.map((event, index) => (
        <div key={event.id || index} className="relative">
          {/* Timeline Node Icon wrapper */}
          <span
            className={`absolute -left-[35px] top-0 flex items-center justify-center w-8 h-8 rounded-full border shadow-sm ${getEventColorClass(
              event.action
            )}`}
          >
            {getEventIcon(event.action)}
          </span>

          {/* Event Content */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
            <div>
              <p className="font-medium text-sm text-foreground">{event.action}</p>
              <p className="text-xs text-muted mt-0.5">By {event.updatedBy}</p>
            </div>
            <time className="text-xs text-muted-text/80 whitespace-nowrap md:mt-0.5 shrink-0">
              {formatDate(event.timestamp)}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}
