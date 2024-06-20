'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const getHash = () =>
  typeof window !== 'undefined'
    ? decodeURIComponent(window.location.hash.replace('#', ''))
    : undefined;

type Props = {};

const Sidebar = (props: Props) => {
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

  return (
    <div className="flex flex-col w-fit gap-y-3">
      <Link
        href="#sales"
        className={`rounded ${
          hash === 'sales'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        Sales
      </Link>
      <Link
        href="#expenses"
        className={`rounded ${
          hash === 'expenses'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        Expenses
      </Link>
      <Link
        href="#other"
        className={`rounded ${
          hash === 'other'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        Other
      </Link>
    </div>
  );
};

export default Sidebar;
