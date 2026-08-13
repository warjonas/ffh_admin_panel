'use client';

import { getRole } from '@/actions/getRole';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import useSWR from 'swr';

type Props = {};

const fetcher = (email: string) => getRole(email).then((res) => res);

const Details = (props: Props) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  const {
    data: role,
    error: roleError,
    isLoading: roleLoading,
  }: { data: string; error: any; isLoading: any } = useSWR(
    !isLoading ? user?.email : null,
    fetcher,
  );

  return (
    <div className=" hidden lg:flex items-center justify-center h-full">
      <h1 className="font-semibold  mr-2">Signed In as:</h1>
      <h2>
        {user?.email} - {role}
      </h2>
    </div>
  );
};

export default Details;
