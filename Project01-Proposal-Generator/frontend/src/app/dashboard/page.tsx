'use client';

import Link from 'next/link';
import { Plus, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type { Proposal } from '@/types';

export default function DashboardPage() {
  const [proposals] = useLocalStorage<Proposal[]>('proposals', []);

  const stats = [
    { label: 'Total Proposals', value: proposals.length, icon: FileText, color: 'text-[var(--color-wise-green)]' },
    { label: 'This Month', value: proposals.filter(p => {
      const date = new Date(p.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length, icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Pending Review', value: proposals.filter(p => p.status === 'draft').length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Accepted', value: proposals.filter(p => p.status === 'accepted').length, icon: CheckCircle, color: 'text-green-500' },
  ];

  const recentProposals = proposals
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: Proposal['status']) => {
    const variants: Record<Proposal['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      draft: 'default',
      sent: 'info',
      accepted: 'success',
      rejected: 'danger',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-near-black)] display-text">
            Dashboard
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[var(--color-gray)]">
            Manage your client proposals and track their status.
          </p>
        </div>
        <Link href="/proposals/new">
          <Button>
            <Plus className="w-5 h-5" />
            New Proposal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[var(--color-gray)] truncate">{stat.label}</p>
                  <p className="text-xl sm:text-3xl font-bold text-[var(--color-near-black)] mt-0.5 sm:mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full bg-[var(--color-light-surface)] shrink-0 ${stat.color}`}>
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-near-black)]">
            Recent Proposals
          </h2>
          <Link
            href="/proposals"
            className="text-sm font-semibold text-[var(--color-dark-green)] hover:underline"
          >
            View All
          </Link>
        </div>

        {recentProposals.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-[var(--color-gray)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-near-black)] mb-2">
              No proposals yet
            </h3>
            <p className="text-[var(--color-gray)] mb-6">
              Create your first proposal to get started.
            </p>
            <Link href="/proposals/new">
              <Button>
                <Plus className="w-5 h-5" />
                Create Proposal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {recentProposals.map((proposal) => (
              <Link
                key={proposal.id}
                href={`/proposals/${proposal.id}`}
                className="block p-3 sm:p-4 rounded-[var(--radius-card)] border border-[rgba(14,15,12,0.12)] hover:border-[var(--color-wise-green)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-[var(--color-near-black)] truncate">
                      {proposal.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-gray)] mt-0.5">
                      {proposal.clientName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base sm:text-lg font-bold text-[var(--color-near-black)]">
                      ${proposal.pricing.total.toLocaleString()}
                    </span>
                    <div className="hidden sm:block">
                      {getStatusBadge(proposal.status)}
                    </div>
                  </div>
                </div>
                <div className="sm:hidden mt-2">
                  {getStatusBadge(proposal.status)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
