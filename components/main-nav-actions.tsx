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
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = {};

const MainNavActions = (props: Props) => {
  const pathname = usePathname();
  const params = useParams();

  const actions = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard />,
      link: '/',
      active: pathname === `/`,
    },
    {
      name: 'Arrangements',
      icon: <ScrollText />,
      link: '/arrangements',
      active:
        pathname === `/arrangements` ||
        pathname === `/arrangements/${params.arrangementId}`,
    },
    {
      name: 'Removals',
      icon: <Car />,
      link: '/removals',
      active: pathname === `/removals`,
    },
    {
      name: 'Programs',
      icon: <LayoutList />,
      link: '/programs',
      active: pathname === `/programs`,
    },
    {
      name: 'Receipts',
      icon: <Receipt />,
      link: '/invoices',
      active: pathname === `/invoices`,
    },
    {
      name: 'Statistics',
      icon: <BarChart />,
      link: '/stats',
      active: pathname === `/stats`,
    },
  ];

  return (
    <ul className="flex flex-col">
      {actions.map((action) => (
        <Link href={action.link} key={action.name}>
          <li
            className={cn(
              'flex p-5 gap-5 lg:text-xl rounded-md',
              action.active
                ? 'bg-primary-foreground text-secondary-foreground'
                : 'hover:bg-primary'
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
