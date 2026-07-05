'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Bell,
  Users,
  BarChart3,
  LogOut,
  Shield,
  School,
  X,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

export function Sidebar({ user, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = user.role === 'admin';

  const menuItems = [
    // Shared / Role-based links
    {
      name: 'Dashboard',
      href: isAdmin ? '/admin/dashboard' : '/dashboard',
      icon: LayoutDashboard,
      roles: ['parent', 'teacher', 'admin'],
    },
    {
      name: 'Report Issue',
      href: '/dashboard/report',
      icon: PlusCircle,
      roles: ['parent', 'teacher'],
    },
    {
      name: 'My Reports',
      href: '/dashboard/my-reports',
      icon: ClipboardList,
      roles: ['parent', 'teacher'],
    },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      roles: ['parent', 'teacher', 'admin'],
    },
    // Admin specific links
    {
      name: 'Issue Management',
      href: '/admin/issues',
      icon: ClipboardList,
      roles: ['admin'],
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Analytics & Reports',
      href: '/admin/analytics',
      icon: BarChart3,
      roles: ['admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col w-64 border-r border-border bg-card text-foreground transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border/60">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
            <School className="w-6 h-6" />
            <span>EduKeep</span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md opacity-70 hover:opacity-100 lg:hidden hover:bg-muted-background"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile card quick-view */}
        <div className="p-4 mx-4 mt-4 border border-border/60 rounded-xl bg-muted-background/40">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate">{user.name}</h4>
              <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {user.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-muted hover:text-foreground hover:bg-muted-background'
                )}
              >
                <Icon className={cn('w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105', isActive ? 'text-white' : 'text-muted group-hover:text-foreground')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-border/60 space-y-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-xl text-muted hover:text-foreground hover:bg-muted-background transition"
          >
            <span className="flex items-center gap-3">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-muted-background rounded-full">
              {theme === 'light' ? 'Off' : 'On'}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:text-white hover:bg-red-500/90 transition group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
