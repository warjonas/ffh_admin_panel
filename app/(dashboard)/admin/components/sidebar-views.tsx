'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Coffins from './coffins';
import Graves from './graves';
import Tombstones from './tombstones';
import Users from './users';
import AddOns from './addOns';

type Props = {};

const getHash = () =>
  typeof window !== 'undefined'
    ? decodeURIComponent(window.location.hash.replace('#', ''))
    : undefined;

const SidebarViews = (props: Props) => {
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
    case 'users':
      return <Users />;
    case 'tombstones':
      return <Tombstones />;
    case 'coffins':
      return <Coffins />;
    case 'graves':
      return <Graves />;
    case 'addOns':
      return <AddOns />;
    default:
      return <div>Please choose an option</div>;
  }
};

export default SidebarViews;
