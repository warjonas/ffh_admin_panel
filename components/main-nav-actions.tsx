'use client';

import Link from 'next/link';
import React from 'react';
import {
  BarChart,
  Car,
  LayoutDashboard,
  LayoutList,
  Receipt,
  ScrollText,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {};

const actions = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard />,
    link: '/',
  },
  {
    name: 'Arrangements',
    icon: <ScrollText />,
    link: '/arrangements',
  },
  {
    name: 'Removals',
    icon: <Car />,
    link: '/removals',
  },
  {
    name: 'Programs',
    icon: <LayoutList />,
    link: '/programs',
  },
  {
    name: 'Receipts',
    icon: <Receipt />,
    link: '/invoices',
  },
  {
    name: 'Statistics',
    icon: <BarChart />,
    link: '/stats',
  },
];

const MainNavActions = (props: Props) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {actions.map((action) => (
        <Link href={action.link}>
          <li
            className={cn(
              'flex p-5 gap-5 lg:text-xl rounded-md',
              pathname === action.link
                ? 'bg-foreground text-white'
                : 'hover:bg-primary-foreground'
            )}
          >
            {action.icon} <span className="hidden md:block">{action.name}</span>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default MainNavActions;
