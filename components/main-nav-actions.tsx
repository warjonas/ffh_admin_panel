'use client';

import Link from 'next/link';
import React, { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import AddDeceasedModal from './modals/add-deceased-modal';
import { Deceased } from '@prisma/client';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';
import { useArrangementModal } from '@/hooks/use-arrangement-modal';

type Props = {};

const MainNavActions = (props: Props) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deceasedModal = useDeceasedModal();
  const arrangementModal = useArrangementModal();

  const actions = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard />,
      link: '/',
      active: pathname === `/`,
      items: [
        {
          title: 'Home',
          link: '/',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },
      ],
    },
    {
      name: 'Funeral Services',
      icon: <ScrollText />,

      items: [
        {
          title: 'Add Deceased Details',
          link: '',
          break: false,
          type: 'Function',
          func: deceasedModal.onOpen,
        },
        {
          title: 'Deceased Details',
          link: '/deceased',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'View Funeral Arrangements',
          link: '/arrangements',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },

        {
          title: 'Create new Arrangement',
          link: '/arrangements/new',
          break: true,
          type: 'Function',
          func: arrangementModal.onOpen,
        },
        {
          title: 'Funeral Programs',
          link: '/programs',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
      ],
    },
    {
      name: 'Removals',
      icon: <Car />,

      items: [
        {
          title: 'All Removals',
          link: '/removals',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'Schedule body removal',
          link: '/removals/new',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'Upcoming Body Removals',
          link: '/removals',
          break: false,
          type: 'Function',
          func: () => setOpen(true),
        },
      ],
    },
    {
      name: 'Financial Services',
      icon: <Receipt />,
      link: '/invoices',
      items: [
        {
          title: 'Invoices',
          link: '/invoices',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'All Payments',
          link: '/invoices',
          break: false,
          type: 'Function',
          func: () => setOpen(true),
        },
        {
          title: 'Outstanding Payments',
          link: '/invoices',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'New Payment Receipt',
          link: '/invoices',
          break: false,
          type: 'Function',
          func: () => setOpen(true),
        },
      ],
    },
    {
      name: 'Admin Utilities',
      icon: <BarChart />,
      link: '/admin',
      items: [
        {
          title: 'Pricing',
          link: '/admin/pricing',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },

        {
          title: 'Manage Fortuin Website',
          link: '/admin/site',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'Settings',
          link: '/admin',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
      ],
    },
  ];

  return (
    <>
      <ul className="flex gap-x-2">
        {actions.map((action) => (
          <DropdownMenu key={action.name}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                {action.icon} {action.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{action.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {action.items?.map((item) => (
                  <div key={item.title}>
                    <DropdownMenuItem
                      onClick={
                        item.type === 'Function'
                          ? item.func
                          : () => router.push(item.link)
                      }
                    >
                      {item.title}
                    </DropdownMenuItem>
                    {item.break && <DropdownMenuSeparator />}
                  </div>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </ul>
    </>
  );
};

export default MainNavActions;
