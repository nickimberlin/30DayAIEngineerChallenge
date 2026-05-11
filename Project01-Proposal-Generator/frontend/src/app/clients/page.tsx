'use client';

import { useState } from 'react';
import { Plus, Users, Trash2, Mail, Phone, Building } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type { Client } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function ClientsPage() {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, newClient]);
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-near-black)] display-text mb-2">
            Clients
          </h1>
          <p className="text-[var(--color-gray)]">
            Manage your client contacts for faster proposal creation.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" />
          Add Client
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredClients.length === 0 ? (
          <Card padding="lg" className="text-center">
            <Users className="w-12 h-12 mx-auto text-[var(--color-gray)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-near-black)] mb-2">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-[var(--color-gray)] mb-6">
              {searchQuery
                ? 'Try a different search term.'
                : 'Add your first client to get started.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5" />
                Add Client
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} padding="md" className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-wise-green)] flex items-center justify-center">
                      <span className="text-sm font-bold text-[var(--color-dark-green)]">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-near-black)]">
                        {client.name}
                      </h3>
                      {client.company && (
                        <p className="text-sm text-[var(--color-gray)]">
                          {client.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="p-1 rounded hover:bg-[var(--color-light-surface)]"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--color-danger-red)]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {client.email && (
                    <div className="flex items-center gap-2 text-[var(--color-gray)]">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-[var(--color-gray)]">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2 text-[var(--color-gray)]">
                      <Building className="w-4 h-4" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <p className="mt-4 text-xs text-[var(--color-gray)] line-clamp-2 border-t border-[rgba(14,15,12,0.12)] pt-3">
                    {client.notes}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateClientModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createClient}
          />
        )}
      </div>
  );
}

function CreateClientModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onCreate(formData);
      onClose();
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-[var(--radius-section)] border border-[rgba(14,15,12,0.12)] p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-[var(--color-near-black)] mb-4">
          Add New Client
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name *</label>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="John Smith"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Company</label>
            <Input
              value={formData.company}
              onChange={handleChange('company')}
              placeholder="Acme Inc."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <Input
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="123 Main St, City, State 12345"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Additional notes about this client..."
              className="input min-h-[80px] resize-y"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              Add Client
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
