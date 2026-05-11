'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Clock, CheckCircle, XCircle, ArrowRight, Trash2, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge, Modal } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type { Proposal } from '@/types';

export default function ProposalsPage() {
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('proposals', []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState<string | null>(null);

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'sent':
        return <FileText className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Proposal['status']) => {
    const config: Record<Proposal['status'], { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      draft: { variant: 'default', label: 'Draft' },
      sent: { variant: 'info', label: 'Sent' },
      accepted: { variant: 'success', label: 'Accepted' },
      rejected: { variant: 'danger', label: 'Rejected' },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const handleDeleteClick = (e: React.MouseEvent, proposalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setProposalToDelete(proposalId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (proposalToDelete) {
      setProposals((prev) => prev.filter((p) => p.id !== proposalToDelete));
      setDeleteModalOpen(false);
      setProposalToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProposalToDelete(null);
  };

  const sortedProposals = [...proposals].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const proposalToDeleteData = proposalToDelete ? proposals.find(p => p.id === proposalToDelete) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Modal open={deleteModalOpen} onClose={cancelDelete} title="Delete Proposal">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[rgba(208,50,56,0.08)] rounded-[var(--radius-card)]">
            <AlertTriangle className="w-5 h-5 text-[var(--color-danger-red)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[var(--color-near-black)]">Are you sure you want to delete this proposal?</p>
              {proposalToDeleteData && (
                <p className="text-sm text-[var(--color-gray)] mt-1">
                  &quot;{proposalToDeleteData.title}&quot; will be permanently deleted. This action cannot be undone.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-near-black)] display-text mb-1 sm:mb-2">
            Proposals
          </h1>
          <p className="text-[var(--color-gray)] text-sm sm:text-base hidden sm:block">
            All your client proposals in one place.
          </p>
        </div>
        <Link href="/proposals/new">
          <Button>
            <Plus className="w-5 h-5" />
            New Proposal
          </Button>
        </Link>
      </div>

      {sortedProposals.length === 0 ? (
        <Card padding="lg" className="text-center">
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
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedProposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/proposals/${proposal.id}`}
              className="block"
            >
              <Card
                padding="md"
                className="hover:border-[var(--color-wise-green)] transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="p-2 sm:p-3 rounded-full bg-[var(--color-light-surface)] shrink-0">
                      {getStatusIcon(proposal.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[var(--color-near-black)] group-hover:text-[var(--color-dark-green)] transition-colors truncate">
                        {proposal.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs sm:text-sm text-[var(--color-gray)]">
                        <span className="truncate">{proposal.clientName}</span>
                        <span className="hidden xs:inline">•</span>
                        <span className="hidden xs:inline">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-xl font-bold text-[var(--color-near-black)]">
                        ${proposal.pricing.total.toLocaleString()}
                      </span>
                      <div className="sm:hidden mt-1">
                        {getStatusBadge(proposal.status)}
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      {getStatusBadge(proposal.status)}
                    </div>
                    {proposal.status === 'draft' && (
                      <button
                        onClick={(e) => handleDeleteClick(e, proposal.id)}
                        className="p-2 rounded-full text-[var(--color-gray)] hover:text-[var(--color-danger-red)] hover:bg-[rgba(208,50,56,0.08)] transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete proposal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-gray)] group-hover:text-[var(--color-dark-green)] transition-colors" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}