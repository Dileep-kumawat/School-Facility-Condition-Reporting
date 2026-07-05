'use client';

import React, { useState, useMemo } from 'react';
import { User, UserRole } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { DEFAULT_AVATAR } from '@/lib/constants';
import { Search, Shield, User as UserIcon, GraduationCap, AlertCircle } from 'lucide-react';

interface AdminUsersClientProps {
  initialUsers: User[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'All' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [initialUsers, searchTerm, selectedRole]);

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border border-red-500/25';
      case 'teacher':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/25';
      case 'parent':
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/25';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'teacher':
        return <GraduationCap className="w-3 h-3" />;
      case 'parent':
        return <UserIcon className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-muted-background/25 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary transition capitalize"
          >
            <option value="All">All Roles</option>
            <option value="parent">Parents</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Administrators</option>
          </select>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted-background/45 text-muted uppercase font-semibold text-[10px] tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role Badge</th>
                <th className="p-4">School ID</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/55">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted-background/15 transition-colors">
                    {/* User profile details */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || DEFAULT_AVATAR}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-border/50 shrink-0"
                        />
                        <span className="font-bold text-foreground truncate max-w-[150px] sm:max-w-xs">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 font-medium text-muted-text">{user.email}</td>

                    {/* Role badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* School ID */}
                    <td className="p-4 text-muted-text font-semibold font-mono">{user.schoolId}</td>

                    {/* Joined Date */}
                    <td className="p-4 text-muted font-medium">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
