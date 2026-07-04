'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { User, Notification } from '@/types';
import { logoutAction, markNotificationReadAction } from '@/app/actions';
import { ToastProvider } from '../ui/Toast';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  user: User;
  notifications: Notification[];
  children: React.ReactNode;
}

export function DashboardLayout({ user, notifications, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logoutAction();
    }
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationReadAction(id);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <TopNavbar
            user={user}
            setSidebarOpen={setSidebarOpen}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onLogout={handleLogout}
          />

          {/* Main content wrapper */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
export default DashboardLayout;
