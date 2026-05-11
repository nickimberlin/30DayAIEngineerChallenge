'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Plus } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[rgba(14,15,12,0.12)] safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 px-6 py-2
                text-xs font-semibold
                transition-all duration-200
                ${isActive
                  ? 'text-[var(--color-dark-green)]'
                  : 'text-[var(--color-gray)]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/proposals/new"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-xs font-semibold text-[var(--color-dark-green)]"
        >
          <div className="w-12 h-12 -mt-6 rounded-full bg-[var(--color-wise-green)] flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </nav>
  );
}