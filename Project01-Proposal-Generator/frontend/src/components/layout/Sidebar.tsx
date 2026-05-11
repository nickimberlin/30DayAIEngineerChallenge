'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Users,
  Settings,
  ArrowLeft,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-64 min-h-screen bg-white border-r border-[rgba(14,15,12,0.12)] p-4 ${className}`}
    >
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3
                rounded-[var(--radius-card)]
                text-sm font-semibold
                transition-all duration-200
                ${isActive
                  ? 'bg-[var(--color-wise-green)] text-[var(--color-dark-green)]'
                  : 'text-[var(--color-gray)] hover:bg-[rgba(22,51,0,0.08)] hover:text-[var(--color-near-black)]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-[rgba(14,15,12,0.12)]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-sm font-semibold text-[var(--color-gray)] hover:bg-[rgba(22,51,0,0.08)] hover:text-[var(--color-near-black)] transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>

      <div className="mt-8 p-4 bg-[var(--color-light-mint)] rounded-[var(--radius-large)]">
        <p className="text-xs font-semibold text-[var(--color-dark-green)] mb-2">
          Need help?
        </p>
        <p className="text-xs text-[var(--color-dark-green)]">
          Check out our documentation for tips and guides.
        </p>
      </div>
    </aside>
  );
}
