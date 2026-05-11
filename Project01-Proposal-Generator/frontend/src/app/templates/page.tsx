'use client';

import { useState } from 'react';
import { Plus, LayoutTemplate, Trash2, Copy, Star } from 'lucide-react';
import { Card, Button, Badge, Input } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import type { Template } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function TemplatesPage() {
  const [templates, setTemplates] = useLocalStorage<Template[]>('templates', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createTemplate = (name: string, description: string) => {
    const newTemplate: Template = {
      id: uuidv4(),
      name,
      description,
      sections: [],
      pricing: {
        items: [],
        subtotal: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        total: 0,
        currency: 'USD',
      },
      branding: {
        logoUrl: '',
        primaryColor: '#9fe870',
        secondaryColor: '#163300',
        accentColor: '#0e0f0c',
        fontFamily: 'Inter',
        companyName: 'Your Company',
        tagline: 'Professional Services',
      },
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: uuidv4(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const toggleDefault = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id ? !t.isDefault : false,
        updatedAt: new Date().toISOString(),
      }))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-near-black)] display-text mb-1 sm:mb-2">
            Templates
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-gray)] hidden sm:block">
            Create and manage reusable proposal templates.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" />
          New Template
        </Button>
      </div>

      <div className="mb-4 sm:mb-6">
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredTemplates.length === 0 ? (
          <Card padding="lg" className="text-center">
            <LayoutTemplate className="w-12 h-12 mx-auto text-[var(--color-gray)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-near-black)] mb-2">
              No templates yet
            </h3>
            <p className="text-[var(--color-gray)] mb-6">
              Create your first template to speed up proposal creation.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5" />
              Create Template
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} padding="md" className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-[var(--color-dark-green)]" />
                    <h3 className="font-semibold text-[var(--color-near-black)]">
                      {template.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {template.isDefault ? (
                      <Star className="w-4 h-4 text-[var(--color-wise-green)] fill-current" />
                    ) : (
                      <button
                        onClick={() => toggleDefault(template.id)}
                        className="p-1 rounded hover:bg-[var(--color-light-surface)]"
                        title="Set as default"
                      >
                        <Star className="w-4 h-4 text-[var(--color-gray)]" />
                      </button>
                    )}
                    <button
                      onClick={() => duplicateTemplate(template)}
                      className="p-1 rounded hover:bg-[var(--color-light-surface)]"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-[var(--color-gray)]" />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-1 rounded hover:bg-[var(--color-light-surface)]"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-[var(--color-danger-red)]" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-gray)] mb-4 line-clamp-2">
                  {template.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--color-gray)]">
                  <span>{template.sections.length} sections</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>

                {template.isDefault && (
                  <Badge variant="success" size="sm" className="mt-3">
                    Default
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateTemplateModal
            onClose={() => setShowCreateModal(false)}
            onCreate={createTemplate}
          />
        )}
      </div>
  );
}

function CreateTemplateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-[var(--radius-section)] border border-[rgba(14,15,12,0.12)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-near-black)] mb-4">
          Create Template
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web Development Proposal"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of when to use this template..."
              className="input min-h-[80px] resize-y"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
