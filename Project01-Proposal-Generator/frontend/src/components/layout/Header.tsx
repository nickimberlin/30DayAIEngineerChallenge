'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FileText, LayoutDashboard, LayoutTemplate, Users, Settings, Sparkles, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[rgba(14,15,12,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[var(--radius-pill)] bg-[var(--color-wise-green)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--color-dark-green)]" />
            </div>
            <span className="font-bold text-xl text-[var(--color-near-black)] hidden sm:block">
              ProposalAI
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2
                    rounded-[var(--radius-pill)]
                    text-sm font-semibold
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)]'
                      : 'text-[var(--color-gray)] hover:text-[var(--color-near-black)] hover:bg-[var(--color-light-surface)]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/proposals/new"
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--color-wise-green)] text-[var(--color-dark-green)] font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:block">New Proposal</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-[var(--radius-pill)] hover:bg-[var(--color-light-surface)]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--color-near-black)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--color-near-black)]" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[rgba(14,15,12,0.12)]">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3
                      rounded-[var(--radius-card)]
                      text-base font-semibold
                      transition-all duration-200
                      ${isActive
                        ? 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)]'
                        : 'text-[var(--color-gray)] hover:text-[var(--color-near-black)] hover:bg-[var(--color-light-surface)]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
