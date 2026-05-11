'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Save, Download, Send, Pencil, Trash2, Menu } from 'lucide-react';
import Link from 'next/link';
import { Card, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Textarea } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type { Proposal } from '@/types';

export default function ProposalEditorPage() {
  const params = useParams();
  const proposalId = params.id as string;
  const [proposals, setProposals] = useLocalStorage<Proposal[]>('proposals', []);
  const proposal = proposals.find((p) => p.id === proposalId);
  const overviewSection = proposal?.sections.find((s) => s.type === 'overview');
  const firstTabId = overviewSection?.id || proposal?.sections[0]?.id || 'overview-0';
  const [activeSection, setActiveSection] = useState(firstTabId);
  const [showSidebar, setShowSidebar] = useState(false);

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <Card padding="lg" className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-[var(--color-near-black)] mb-2">
            Proposal Not Found
          </h2>
          <p className="text-[var(--color-gray)] mb-6">
            The proposal you are looking for does not exist or has been deleted.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const updateProposal = (updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const updateSection = (sectionId: string, content: string) => {
    const updatedSections = proposal.sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s
    );
    updateProposal({ sections: updatedSections });
  };

  const updatePricingItem = (itemId: string, updates: Partial<typeof proposal.pricing.items[0]>) => {
    const updatedItems = proposal.pricing.items.map((item) =>
      item.id === itemId ? { ...item, ...updates, total: (updates.quantity ?? item.quantity) * (updates.unitPrice ?? item.unitPrice) } : item
    );
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    updateProposal({
      pricing: { ...proposal.pricing, items: updatedItems, subtotal, total: subtotal }
    });
  };

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
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[rgba(14,15,12,0.12)]">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Link href="/proposals" className="shrink-0">
              <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <div className="hidden xs:block h-5 sm:h-6 w-px bg-[rgba(14,15,12,0.12)] shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm sm:text-base text-[var(--color-near-black)] truncate">{proposal.title}</h1>
              <p className="text-xs text-[var(--color-gray)] hidden sm:block">{proposal.clientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="p-1.5 sm:p-2" onClick={() => setShowSidebar(true)}>
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="hidden sm:block">
              {getStatusBadge(proposal.status)}
            </div>
            <Button variant="secondary" size="sm" className="hidden sm:flex">
              <Save className="w-4 h-4" />
              <span className="hidden lg:inline">Save</span>
            </Button>
            <Button variant="secondary" size="sm" className="hidden md:flex">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export PDF</span>
            </Button>
            <Button size="sm" className="hidden sm:flex">
              <Send className="w-4 h-4" />
              <span className="hidden lg:inline">Send</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 xl:col-span-2 space-y-4 sm:space-y-6">
            <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="flex-wrap sm:flex-nowrap">
                  {proposal.sections.map((section) => (
                    <TabsTrigger key={section.id} value={section.id} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                      {section.title}
                    </TabsTrigger>
                  ))}
                  <TabsTrigger value="pricing" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5">Pricing</TabsTrigger>
                </TabsList>
              </div>

              {proposal.sections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <Card padding="md">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-near-black)]">
                        {section.title}
                      </h2>
                      <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      className="min-h-[200px] sm:min-h-[300px] font-mono text-sm"
                    />
                  </Card>
                </TabsContent>
              ))}

              <TabsContent value="pricing">
                <Card padding="md">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-near-black)]">
                      Pricing
                    </h2>
                    <Button size="sm" variant="secondary">
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4 sm:space-y-0 sm:overflow-x-auto">
                    <div className="hidden sm:table w-full">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[rgba(14,15,12,0.12)]">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-gray)]">Description</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-gray)]">Qty</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-gray)]">Unit Price</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-gray)]">Total</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposal.pricing.items.map((item) => (
                            <tr key={item.id} className="border-b border-[rgba(14,15,12,0.12)]">
                              <td className="py-3 px-4">
                                <input type="text" value={item.description} onChange={(e) => updatePricingItem(item.id, { description: e.target.value })} className="input text-sm" />
                              </td>
                              <td className="py-3 px-4">
                                <input type="number" value={item.quantity} onChange={(e) => updatePricingItem(item.id, { quantity: parseInt(e.target.value) || 0 })} className="input text-sm text-right w-20" />
                              </td>
                              <td className="py-3 px-4">
                                <input type="number" value={item.unitPrice} onChange={(e) => updatePricingItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} className="input text-sm text-right w-28" />
                              </td>
                              <td className="py-3 px-4 text-right font-semibold">${item.total.toLocaleString()}</td>
                              <td className="py-3 px-2">
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Trash2 className="w-4 h-4 text-[var(--color-danger-red)]" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="py-3 px-4 text-right font-semibold text-[var(--color-gray)]">Subtotal</td>
                            <td className="py-3 px-4 text-right font-bold text-lg">${proposal.pricing.subtotal.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="py-3 px-4 text-right font-semibold text-[var(--color-gray)]">Total</td>
                            <td className="py-3 px-4 text-right font-bold text-2xl text-[var(--color-wise-green)]">${proposal.pricing.total.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="sm:hidden space-y-3">
                      {proposal.pricing.items.map((item) => (
                        <div key={item.id} className="p-3 bg-[var(--color-light-surface)] rounded-[var(--radius-card)] space-y-2">
                          <div className="flex justify-between items-start">
                            <input type="text" value={item.description} onChange={(e) => updatePricingItem(item.id, { description: e.target.value })} className="input text-sm flex-1 mr-2" />
                            <Button variant="ghost" size="sm" className="p-1 shrink-0">
                              <Trash2 className="w-4 h-4 text-[var(--color-danger-red)]" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-xs text-[var(--color-gray)]">Qty</label>
                              <input type="number" value={item.quantity} onChange={(e) => updatePricingItem(item.id, { quantity: parseInt(e.target.value) || 0 })} className="input text-sm w-full" />
                            </div>
                            <div className="flex-1">
                              <label className="text-xs text-[var(--color-gray)]">Price</label>
                              <input type="number" value={item.unitPrice} onChange={(e) => updatePricingItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} className="input text-sm w-full" />
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <label className="text-xs text-[var(--color-gray)]">Total</label>
                              <p className="font-bold text-lg">${item.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between py-2 border-t border-[rgba(14,15,12,0.12)]">
                        <span className="font-semibold text-[var(--color-gray)]">Subtotal</span>
                        <span className="font-bold">${proposal.pricing.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-bold text-[var(--color-near-black)]">Total</span>
                        <span className="font-bold text-2xl text-[var(--color-wise-green)]">${proposal.pricing.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden xl:block space-y-6">
            <Card padding="lg">
              <h3 className="font-semibold text-[var(--color-near-black)] mb-4">
                Client Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-gray)] mb-1">Name</label>
                  <input type="text" value={proposal.clientName} onChange={(e) => updateProposal({ clientName: e.target.value })} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-gray)] mb-1">Email</label>
                  <input type="email" value={proposal.clientEmail} onChange={(e) => updateProposal({ clientEmail: e.target.value })} className="input text-sm" />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="font-semibold text-[var(--color-near-black)] mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Created</span>
                  <span className="font-semibold">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Updated</span>
                  <span className="font-semibold">{new Date(proposal.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Sections</span>
                  <span className="font-semibold">{proposal.sections.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Total</span>
                  <span className="font-bold text-lg text-[var(--color-wise-green)]">${proposal.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--color-near-black)]">Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>X</Button>
            </div>

            <Card padding="lg">
              <h3 className="font-semibold text-[var(--color-near-black)] mb-4">Client Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--color-gray)] mb-1">Name</label>
                  <input type="text" value={proposal.clientName} onChange={(e) => updateProposal({ clientName: e.target.value })} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-gray)] mb-1">Email</label>
                  <input type="email" value={proposal.clientEmail} onChange={(e) => updateProposal({ clientEmail: e.target.value })} className="input text-sm" />
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="font-semibold text-[var(--color-near-black)] mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Status</span>
                  {getStatusBadge(proposal.status)}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Created</span>
                  <span className="font-semibold">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray)]">Updated</span>
                  <span className="font-semibold">{new Date(proposal.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Button variant="secondary" className="w-full">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="secondary" className="w-full">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button className="w-full">
                <Send className="w-4 h-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}