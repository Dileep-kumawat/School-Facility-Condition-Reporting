'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Notification } from '@/types';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR } from '@/lib/constants';
import { Bell, Menu, Search, User as UserIcon, LogOut, Check } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface TopNavbarProps {
  user: User;
  setSidebarOpen: (open: boolean) => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onLogout: () => void;
}

export function TopNavbar({
  user,
  setSidebarOpen,
  notifications,
  onMarkRead,
  onLogout,
}: TopNavbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/dashboard')) return 'Admin Dashboard';
    if (pathname.startsWith('/admin/issues')) return 'Manage Facility Issues';
    if (pathname.startsWith('/admin/users')) return 'Manage Portal Users';
    if (pathname.startsWith('/admin/analytics')) return 'System Analytics & Reports';
    if (pathname.startsWith('/dashboard/report')) return 'Report New Issue';
    if (pathname.startsWith('/dashboard/my-reports')) return 'My Reported Issues';
    if (pathname.startsWith('/dashboard/reports')) return 'Issue Investigation';
    if (pathname.startsWith('/dashboard/notifications')) return 'Notification Feed';
    if (pathname.startsWith('/dashboard')) return 'Reporter Dashboard';
    return 'Facility Portal';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 border-b border-border bg-card/85 backdrop-blur-md">
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-muted-background lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg tracking-tight hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Search, Notifications, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Placeholder */}
        <div className="relative max-w-xs hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search report IDs, buildings..."
            className="w-64 h-9 pl-9 pr-4 rounded-lg border border-border bg-muted-background/40 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted-background transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-card animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-10 bg-transparent"
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-2 text-foreground shadow-xl z-20 glass-panel">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
                  <span className="font-bold text-xs">Notifications</span>
                  {unreadCount > 0 && (
                    <Link
                      href="/dashboard/notifications"
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      View all ({unreadCount} new)
                    </Link>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted text-[11px] py-6">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          'p-3 rounded-lg hover:bg-muted-background transition-colors flex gap-2.5 items-start text-xs border-b border-border/20 last:border-b-0',
                          !n.read && 'bg-primary/5'
                        )}
                      >
                        <div className="flex-1">
                          <h5 className={cn('font-medium', !n.read && 'text-primary')}>{n.title}</h5>
                          <p className="text-muted text-[10px] mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[9px] text-muted block mt-1">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => onMarkRead(n.id)}
                            className="p-1 rounded bg-muted-background hover:bg-primary/10 hover:text-primary transition shrink-0"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-muted-background transition focus:outline-none"
          >
            <img
              src={user.avatar || DEFAULT_AVATAR}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
            />
          </button>

          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                className="fixed inset-0 z-10 bg-transparent"
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1 text-foreground shadow-xl z-20">
                <div className="px-3 py-2 border-b border-border/60">
                  <p className="font-semibold text-xs leading-none">{user.name}</p>
                  <p className="text-[10px] text-muted mt-1 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted-background transition"
                  >
                    <UserIcon className="w-4 h-4 text-muted" />
                    <span>My Account</span>
                  </Link>
                </div>
                <div className="border-t border-border/60 pt-1">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-red-500 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
