'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ExpenseView from './expense-view';
import SalesView from './sales-view';
import OtherView from './other-view';
import { Expense } from '@prisma/client';
import { ExpenseColumns } from './columns/expense-columns';

interface SidebarViewProps {
  expenseData: Expense[];
  tableData: any[];

  salesData?: any[];
}

const getHash = () =>
  typeof window !== 'undefined'
    ? decodeURIComponent(window.location.hash.replace('#', ''))
    : undefined;

const SidebarViews = ({
  expenseData,
  salesData,
  tableData,
}: SidebarViewProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hash, setHash] = useState(getHash());

  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setHash(getHash());
  }, [params]);

  if (!isMounted) return null;

  switch (hash) {
    case 'sales':
      return <SalesView />;
    case 'expenses':
      return <ExpenseView data={expenseData} tableData={tableData} />;
    case 'other':
      return <OtherView />;

    default:
      return <div>Please choose an option</div>;
  }
};

export default SidebarViews;
