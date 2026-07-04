import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { DB } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminUsersClient from './AdminUsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await DB.getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Portal User Accounts</h2>
        <p className="text-xs text-muted mt-1 font-normal">Manage school parent, teacher, and administrator accounts. Verify school enrollment credentials.</p>
      </div>

      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
