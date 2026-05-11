console.log('[storage-proposals] Module initialized');

const STORAGE_KEY = 'proposal-generator-proposals';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    console.log('[storage] getFromStorage: SSR, returning fallback for:', key);
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      console.log('[storage] getFromStorage: No data for key:', key);
      return fallback;
    }
    const parsed = JSON.parse(raw);
    console.log('[storage] getFromStorage: Found data for key:', key, 'count:', Array.isArray(parsed) ? parsed.length : 'object');
    return parsed;
  } catch (error) {
    console.error('[storage] getFromStorage: Parse error for key:', key, error);
    return fallback;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (!isBrowser()) {
    console.log('[storage] setToStorage: SSR, skipping for:', key);
    return;
  }
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    console.log('[storage] setToStorage: Saved data for key:', key, 'size:', serialized.length, 'bytes');
  } catch (error) {
    console.error('[storage] setToStorage: Save error for key:', key, error);
  }
}

export function removeFromStorage(key: string): void {
  if (!isBrowser()) {
    console.log('[storage] removeFromStorage: SSR, skipping for:', key);
    return;
  }
  try {
    localStorage.removeItem(key);
    console.log('[storage] removeFromStorage: Removed key:', key);
  } catch (error) {
    console.error('[storage] removeFromStorage: Remove error for key:', key, error);
  }
}

import type { Proposal } from '@/types';

export function getProposals(): Proposal[] {
  console.log('[storage-proposals] getProposals called');
  return getFromStorage<Proposal[]>(STORAGE_KEY, []);
}

export function getProposal(id: string): Proposal | null {
  console.log('[storage-proposals] getProposal called for:', id);
  const proposals = getProposals();
  const found = proposals.find((p) => p.id === id);
  console.log('[storage-proposals] getProposal result:', found ? 'Found' : 'Not found');
  return found || null;
}

export function saveProposal(proposal: Proposal): Proposal {
  console.log('[storage-proposals] saveProposal called for:', proposal.id, proposal.title);
  const proposals = getProposals();
  const existingIndex = proposals.findIndex((p) => p.id === proposal.id);

  const updated = {
    ...proposal,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    console.log('[storage-proposals] Updating existing proposal at index:', existingIndex);
    proposals[existingIndex] = updated;
  } else {
    console.log('[storage-proposals] Adding new proposal');
    proposals.unshift(updated);
  }

  setToStorage(STORAGE_KEY, proposals);
  console.log('[storage-proposals] Proposal saved. Total count:', proposals.length);
  return updated;
}

export function deleteProposal(id: string): boolean {
  console.log('[storage-proposals] deleteProposal called for:', id);
  const proposals = getProposals();
  const filtered = proposals.filter((p) => p.id !== id);

  if (filtered.length < proposals.length) {
    setToStorage(STORAGE_KEY, filtered);
    console.log('[storage-proposals] Proposal deleted. Remaining count:', filtered.length);
    return true;
  }

  console.log('[storage-proposals] Proposal not found for deletion:', id);
  return false;
}

export function getProposalsByStatus(status: Proposal['status']): Proposal[] {
  console.log('[storage-proposals] getProposalsByStatus called for:', status);
  return getProposals().filter((p) => p.status === status);
}
