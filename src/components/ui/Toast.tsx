'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    
    // Auto dismiss
    setTimeout(() => {
      dismiss(id);
    }, 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full"
            >
              <ToastCard message={t} onClose={() => dismiss(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastCard({ message, onClose }: { message: ToastMessage; onClose: () => void }) {
  const { title, description, variant } = message;

  let bgClass = 'bg-card border border-border text-foreground';
  let Icon = Info;
  let iconClass = 'text-primary';

  switch (variant) {
    case 'success':
      bgClass = 'bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-300';
      Icon = CheckCircle2;
      iconClass = 'text-green-500';
      break;
    case 'warning':
      bgClass = 'bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300';
      Icon = AlertTriangle;
      iconClass = 'text-amber-500';
      break;
    case 'error':
      bgClass = 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300';
      Icon = AlertCircle;
      iconClass = 'text-red-500';
      break;
    case 'info':
      bgClass = 'bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300';
      Icon = Info;
      iconClass = 'text-blue-500';
      break;
  }

  return (
    <div className={`flex gap-3 items-start p-4 rounded-xl shadow-lg backdrop-blur-md ${bgClass}`}>
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconClass}`} />
      <div className="flex-1">
        <h4 className="font-semibold text-sm leading-tight">{title}</h4>
        {description && <p className="text-xs opacity-90 mt-1">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
