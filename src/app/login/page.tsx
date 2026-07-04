'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/actions';
import { School, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (res && res.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-background text-foreground transition-colors min-h-screen">
      <div className="w-full max-w-md space-y-8 p-8 border border-border bg-card rounded-2xl shadow-xl glass-panel">
        
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <School className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-center">
            Sign in to EduKeep
          </h2>
          <p className="mt-2 text-xs text-muted text-center">
            Enter your school credentials to access the facility portal
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs animate-shake">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-muted mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="teacher@school.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-muted">
                  Password
                </label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions have been simulated to your school email.');
                  }}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full h-11 pl-3 pr-10 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 opacity-60 hover:opacity-100 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-muted">
              Remember me on this device
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center h-11 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-md shadow-primary/10"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials Notice */}
        <div className="border-t border-border/50 pt-6">
          <div className="p-3.5 rounded-lg bg-muted-background/45 border border-border/40 text-[11px] leading-relaxed text-muted space-y-1">
            <p className="font-semibold text-foreground text-center mb-1">Demo Credentials</p>
            <div className="flex justify-between">
              <span>Admin: <strong className="text-foreground">admin@school.com</strong></span>
              <span>Pass: <strong className="text-foreground">admin123</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Teacher: <strong className="text-foreground">teacher@school.com</strong></span>
              <span>Pass: <strong className="text-foreground">teacher123</strong></span>
            </div>
            <div className="flex justify-between">
              <span>Parent: <strong className="text-foreground">parent@school.com</strong></span>
              <span>Pass: <strong className="text-foreground">parent123</strong></span>
            </div>
          </div>
        </div>

        {/* Sign up Redirect */}
        <p className="text-center text-xs text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
