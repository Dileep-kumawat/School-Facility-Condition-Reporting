'use client';

import React, { useState, useTransition } from 'react';
import { Notification } from '@/types';
import { markNotificationReadAction, markAllNotificationsReadAction } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/Card';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { Bell, Check, CheckCheck, Trash2, ShieldAlert } from 'lucide-react';

interface NotificationsClientProps {
  initialNotifications: Notification[];
  userId: string;
}

export default function NotificationsClient({
  initialNotifications,
  userId,
}: NotificationsClientProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationReadAction(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast({ title: 'Notification marked as read', variant: 'success' });
    });
  };

  const handleMarkAllRead = () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    if (unreadCount === 0) return;

    startTransition(async () => {
      await markAllNotificationsReadAction(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({ title: 'All notifications marked as read', variant: 'success' });
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        {/* Tabs */}
        <div className="flex gap-1.5 p-1 bg-muted-background border border-border/85 rounded-lg text-xs w-fit">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'unread' | 'read')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted-background text-xs font-semibold transition disabled:opacity-40"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <Card className="divide-y divide-border/60">
        {filteredNotifications.length === 0 ? (
          <CardContent className="p-12 text-center text-muted">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm">All caught up!</p>
            <p className="text-xs mt-0.5">No notifications found in this view.</p>
          </CardContent>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition hover:bg-muted-background/10 ${
                !n.read ? 'bg-primary/[0.02]' : ''
              }`}
            >
              <div className="flex gap-4 items-start min-w-0">
                <span
                  className={`p-2.5 rounded-full border shrink-0 ${
                    !n.read
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-muted-background border-border text-muted'
                  }`}
                >
                  <Bell className="w-4.5 h-4.5" />
                </span>
                <div className="min-w-0">
                  <h4 className={`text-sm ${!n.read ? 'font-bold text-foreground' : 'font-semibold text-foreground/80'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-muted-text/90 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-muted block mt-2 font-medium">
                    {formatTimeAgo(n.createdAt)}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:text-primary transition shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
