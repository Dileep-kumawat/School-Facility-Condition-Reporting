'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Issue } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface AdminIssuesClientProps {
  initialIssues: Issue[];
}

const ITEMS_PER_PAGE = 8;

export default function AdminIssuesClient({ initialIssues }: AdminIssuesClientProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Available unique categories
  const categories = useMemo(() => {
    const cats = new Set(issues.map((i) => i.category));
    return ['All', ...Array.from(cats)];
  }, [issues]);

  const priorities = ['All', 'low', 'medium', 'high', 'critical'];
  const statuses = ['All', 'reported', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];

  // Filter and Sort
  const filteredAndSortedIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        const matchesSearch =
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (issue.createdByName && issue.createdByName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
        const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
        const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [issues, searchTerm, selectedCategory, selectedPriority, selectedStatus, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedIssues.length / ITEMS_PER_PAGE);
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedIssues, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters panel */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Title, ID, Location, or Reporter..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-muted-background/25 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            {/* Filter selectors */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted font-medium hidden sm:inline">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 px-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary transition capitalize"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted font-medium hidden sm:inline">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => {
                    setSelectedPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 px-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary transition capitalize"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p === 'All' ? 'All Priorities' : `${p} priority`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted font-medium hidden sm:inline">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 px-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary transition capitalize"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s === 'All' ? 'All Statuses' : s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset button */}
              <button
                onClick={handleResetFilters}
                className="h-10 px-3 rounded-lg border border-border bg-card hover:bg-muted-background transition text-xs font-semibold flex items-center gap-1.5"
                title="Clear all filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Container */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted-background/45 text-muted uppercase font-semibold text-[10px] tracking-wider select-none">
                <th className="p-4 w-24">ID</th>
                <th className="p-4">Report Details</th>
                <th className="p-4 w-32">Reporter</th>
                <th className="p-4 w-24">Priority</th>
                <th className="p-4 w-40">Location</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-36 cursor-pointer hover:text-foreground transition" onClick={toggleSort}>
                  <div className="flex items-center gap-1">
                    <span>Submitted</span>
                    {sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </div>
                </th>
                <th className="p-4 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/55">
              {paginatedIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No reports match your filters</p>
                  </td>
                </tr>
              ) : (
                paginatedIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-muted-background/15 transition-colors">
                    {/* ID */}
                    <td className="p-4 font-semibold text-muted-text/80 font-mono">
                      {issue.id}
                    </td>

                    {/* Image + Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {issue.images[0] ? (
                          <img
                            src={issue.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover bg-muted-background shrink-0"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded-md bg-muted-background flex items-center justify-center text-[10px] text-muted shrink-0">
                            IMG
                          </span>
                        )}
                        <div className="line-clamp-2 max-w-[200px] sm:max-w-xs font-bold text-foreground">
                          {issue.title}
                          <span className="text-[10px] text-muted font-normal block mt-0.5">{issue.category}</span>
                        </div>
                      </div>
                    </td>

                    {/* Reporter */}
                    <td className="p-4">
                      <div className="font-medium text-foreground">
                        {issue.createdByName}
                        <span className="text-[9px] text-primary block mt-0.5 capitalize font-semibold tracking-wide bg-primary/10 w-fit px-1.5 py-0.5 rounded-full">{issue.createdByRole}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <Badge variant="priority" priority={issue.priority} />
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="truncate max-w-[150px]" title={`${issue.building}, ${issue.room}`}>
                        <span className="font-medium text-foreground">{issue.building}</span>
                        <span className="text-muted block text-[10px] mt-0.5 truncate">{issue.room}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <Badge variant="status" status={issue.status} />
                    </td>

                    {/* Submitted Date */}
                    <td className="p-4 text-muted font-medium">
                      {formatDate(issue.createdAt).split(',')[0]}
                      <span className="text-[10px] text-muted-text/75 block mt-0.5">
                        {formatDate(issue.createdAt).split(',')[1]?.trim()}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      <Link
                        href={`/dashboard/reports/${issue.id}`}
                        className="inline-flex p-2 rounded-lg bg-muted-background hover:bg-primary/10 hover:text-primary transition-colors text-muted"
                        title="Route / Investigate Ticket"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/60 bg-muted-background/20 select-none">
            <span className="text-xs text-muted">
              Showing page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong> (
              <strong className="text-foreground">{filteredAndSortedIssues.length}</strong> total records)
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted-background transition text-muted disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted-background transition text-muted disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
