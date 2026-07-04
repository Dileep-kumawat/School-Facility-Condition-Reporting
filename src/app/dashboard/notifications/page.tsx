import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const notifications = await DB.getNotifications(user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Notification Center</h2>
        <p className="text-xs text-muted mt-1 font-normal">Stay up to date with the latest repair status updates, assignment logs, and portal communications.</p>
      </div>

      <NotificationsClient initialNotifications={notifications} userId={user.id} />
    </div>
  );
}
