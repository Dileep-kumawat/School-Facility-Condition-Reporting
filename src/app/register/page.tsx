'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/actions';
import { School, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [schoolId, setSchoolId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (!name || !email || !password || !schoolId) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (schoolId.trim() !== 'SCH-88291') {
      setError('Invalid School Registration Code. Use SCH-88291 for this school.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('schoolId', schoolId);

    startTransition(async () => {
      const res = await registerAction(formData);
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
            Create Account
          </h2>
          <p className="mt-2 text-xs text-muted text-center">
            Register to start reporting facility issues or managing repairs
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs animate-shake">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-muted mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="Jane Doe"
              />
            </div>

            {/* Email Address */}
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
                placeholder="jane.doe@example.com"
              />
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">
                Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['parent', 'teacher', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={isPending}
                    className={`h-10 rounded-lg text-xs font-semibold border capitalize transition-all ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-transparent hover:bg-muted-background'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* School Registration Code */}
            <div>
              <label htmlFor="schoolId" className="block text-xs font-semibold text-muted mb-1.5 flex justify-between">
                <span>School Registration Code</span>
                <span className="text-[10px] text-primary/80 lowercase">(demo code: SCH-88291)</span>
              </label>
              <input
                id="schoolId"
                name="schoolId"
                type="text"
                required
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                disabled={isPending}
                className="w-full h-11 px-3 rounded-lg border border-border bg-muted-background/25 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="SCH-XXXXX"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-muted mb-1.5">
                Password
              </label>
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
                  placeholder="At least 6 characters"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center h-11 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-md shadow-primary/10 mt-6"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-xs text-muted border-t border-border/50 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
