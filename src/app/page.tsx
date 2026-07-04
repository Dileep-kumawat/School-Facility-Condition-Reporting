import React from 'react';
import Link from 'next/link';
import { School, CheckCircle2, Clock, ArrowRight, UserCheck, PlusCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground transition-colors">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 md:px-12 border-b border-border bg-card/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
          <School className="w-6 h-6" />
          <span>EduKeep</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold px-4 py-2 rounded-lg hover:bg-muted-background transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition shadow-md shadow-primary/10"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-radial from-primary/5 via-transparent to-transparent">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Digital Infrastructure Management</span>
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Digital Maintenance & Repair <span className="text-primary bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Tracker for Schools</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-sm md:text-base text-muted leading-relaxed">
            EduKeep connects parents, teachers, and school administrators to report infrastructure problems, upload photo evidence, and monitor repair status in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/register"
              className="flex items-center gap-1.5 w-full sm:w-auto justify-center h-12 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-lg shadow-primary/15 group"
            >
              <span>Register Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 w-full sm:w-auto justify-center h-12 px-6 rounded-xl border border-border bg-card hover:bg-muted-background text-sm font-semibold transition"
            >
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-border bg-muted-background/25 py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {[
            { value: '12+', label: 'Active School Campuses' },
            { value: '420+', label: 'Infrastructure Issues Resolved' },
            { value: '< 24 Hours', label: 'Average Response Time' },
          ].map((stat, i) => (
            <div key={i} className="py-4 sm:py-0">
              <h3 className="text-3xl font-extrabold text-primary">{stat.value}</h3>
              <p className="text-xs text-muted mt-1 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Everything you need to keep classrooms safe</h2>
          <p className="text-xs text-muted">A comprehensive tracking solution that replaces unorganized paperwork with transparent digital workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Direct Media Uploads',
              desc: 'Upload photo and video evidence directly from your phone. Integrates with ImageKit for optimized storage.',
              icon: PlusCircle,
            },
            {
              title: 'Real-Time Progress Feed',
              desc: 'Monitor the status of your reported issues at every step: Under Review, Technician Assigned, and Resolved.',
              icon: Clock,
            },
            {
              title: 'Role-Based Dashboard',
              desc: 'Specialized portals for Parents to submit reports, Teachers to view classrooms, and Admins to allocate resources.',
              icon: UserCheck,
            },
          ].map((feat, i) => (
            <div key={i} className="p-6 border border-border bg-card rounded-2xl shadow-sm space-y-4 hover:shadow-md transition">
              <span className="inline-flex p-3 bg-primary/10 text-primary rounded-xl">
                <feat.icon className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-base">{feat.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-muted-background/35 border-t border-border py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Inspection & Repair Cycle</h2>
            <p className="text-xs text-muted">Transparent workflow that guarantees accountability from first report to final sign-off.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', title: 'Report Issue', desc: 'Parents/teachers submit details, location, and upload media evidence.' },
              { step: '02', title: 'Inspection', desc: 'Administrators review the submission and determine priority levels.' },
              { step: '03', title: 'Repair Assignment', desc: 'Admins assign verified maintenance technicians with target completion dates.' },
              { step: '04', title: 'Verification & Close', desc: 'Reporter receives real-time updates and closes the ticket upon completion.' },
            ].map((item, idx) => (
              <div key={idx} className="relative space-y-3">
                <span className="text-4xl font-extrabold text-primary/20 font-mono block">{item.step}</span>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Loved by school communities</h2>
          <p className="text-xs text-muted mt-2">Hear from teachers and parents who are actively using the system to improve school conditions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              quote: '“Using EduKeep, we got the Grade 5 ceiling fans replaced within 2 days of reporting. The timeline tracking kept us informed and gave us peace of mind.”',
              author: 'Elena Rostova, Parent Representative',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            },
            {
              quote: '“Reporting classroom repairs used to require submitting paper memos. Now, I upload a picture of a leaky faucet from my phone, and it gets routed to the plumber instantly.”',
              author: 'David Miller, Grade 5 Homeroom Teacher',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            },
          ].map((t, i) => (
            <div key={i} className="p-6 border border-border bg-card rounded-2xl shadow-sm space-y-4">
              <p className="text-xs md:text-sm text-foreground/80 leading-relaxed italic">{t.quote}</p>
              <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                <img src={t.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                <span className="text-xs font-bold text-foreground">{t.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-6 md:px-12 mt-auto text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted font-semibold">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-primary" />
            <span>EduKeep Portal System</span>
          </div>
          <p>© 2026 EduKeep. All rights reserved. Designed for active school facility maintenance.</p>
        </div>
      </footer>

    </div>
  );
}
