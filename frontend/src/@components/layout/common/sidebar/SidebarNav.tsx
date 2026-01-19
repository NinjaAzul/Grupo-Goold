'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresPermission?: string;
}

interface SidebarNavProps {
  items: NavItem[];
  onLinkClick?: () => void;
}

export function SidebarNav({ items, onLinkClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 px-4 py-[14px] rounded-md transition-colors cursor-pointer',
                isActive
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
        );
      })}
    </nav>
  );
}

