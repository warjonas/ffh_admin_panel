'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
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
import { Deceased } from '@prisma/client';
import {
  useDeceasedModal,
  useOutstandingPaymentsModal,
  useViewPaymentsModal,
} from '@/hooks/use-deceased-modal';
import { useArrangementModal } from '@/hooks/use-arrangement-modal';
import {
  useRemovalModal,
  useUpcomingRemovalsModal,
} from '@/hooks/use-removal-modal';
import { usePaymentTypeModal } from '@/hooks/use-payment-modal';
import { useRole } from '@/hooks/use-role-store';

type Props = {};

const MainNavActions = (props: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const arrangementModal = useArrangementModal();
  const removalModal = useRemovalModal();
  const upcomingModal = useUpcomingRemovalsModal();
  const paymentType = usePaymentTypeModal();
  const paymentsModal = useViewPaymentsModal();
  const outstandingModal = useOutstandingPaymentsModal();
  const roleStore = useRole();

  const actions = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard />,
      link: '/',
      permision: 'Administrator',
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
      permision: 'General',
      items: [
        {
          title: 'Add Deceased Details',
          link: '/deceased/new',
          break: false,
          type: 'Link',
          func: () => {},
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
          type: 'Link',
          func: () => router.push('/arrangements/new'),
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
      permision: 'General',
      items: [
        {
          title: 'All Removals',
          link: '/removals',
          break: false,
          type: 'Link',
          func: () => {},
        },
        {
          title: 'Schedule body removal',
          link: '/removals/new',
          break: false,
          type: 'Function',
          func: () => {
            router.push('/removals/new');
          },
        },
        {
          title: 'Upcoming Body Removals',
          link: '/removals',
          break: false,
          type: 'Function',
          func: upcomingModal.onOpen,
        },
      ],
    },
    {
      name: 'Financial Services',
      icon: <Receipt />,
      link: '/invoices',
      permision: 'Administrator',
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
          func: paymentsModal.onOpen,
        },
        {
          title: 'Outstanding Payments',
          link: '/invoices',
          break: false,
          type: 'Function',
          func: outstandingModal.onOpen,
        },
        {
          title: 'New Payment',
          link: '/invoices',
          break: false,
          type: 'Function',
          func: paymentType.onOpen,
        },
      ],
    },
    {
      name: 'Admin Utilities',
      icon: <BarChart />,
      link: '/admin',
      permision: 'Administrator',
      items: [
        {
          title: 'Statistics',
          link: '/admin/stats',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'View Expenses',
          link: '/finance',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'New Expense',
          link: '/finance/new',
          break: true,
          type: 'Link',
          func: () => setOpen(true),
        },

        {
          title: 'Manage',
          link: '/admin#coffins',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
        {
          title: 'Website',
          link: '/admin/site',
          break: false,
          type: 'Link',
          func: () => setOpen(true),
        },
      ],
    },
  ];

  return (
    <>
      <ul className="flex gap-x-2 transition-all duration-200">
        {actions.map((action) =>
          roleStore.userRole == 'Administrator' &&
          (action.permision == 'Administrator' ||
            action.permision == 'General') ? (
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
          ) : (
            roleStore.userRole == 'General' &&
            action.permision == 'General' && (
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
            )
          )
        )}
      </ul>
    </>
  );
};

export default MainNavActions;
