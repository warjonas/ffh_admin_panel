'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

type Props = {};

const Details = (props: Props) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div className=" hidden lg:flex items-center justify-center h-full">
      <h1 className="font-semibold  mr-2">Signed In as:</h1>
      <h2>{user?.name}</h2>
    </div>
  );
};

export default Details;
