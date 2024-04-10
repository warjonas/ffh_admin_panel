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
        href="#coffins"
        className={`rounded ${
          hash === 'coffins'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        Coffins
      </Link>
      <Link
        href="#tombstones"
        className={`rounded ${
          hash === 'tombstones'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        Tombstones
      </Link>
      <Link
        href="#graves"
        className={`rounded ${
          hash === 'graves'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300 hover:bg-slate-200`}
      >
        Grave Sites
      </Link>
      <Link
        href="#users"
        className={`rounded ${
          hash === 'users'
            ? 'bg-secondary-foreground text-background shadow'
            : 'hover:bg-slate-200'
        } p-3 font-semibold transition-all ease-in-out duration-300`}
      >
        User Access
      </Link>
    </div>
  );
};

export default Sidebar;
