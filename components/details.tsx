'use client';

import { getRole } from '@/actions/getRole';
import { useRole } from '@/hooks/use-role-store';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

interface DetailProps {
  userDetails?: UserProfile;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Details: React.FC<DetailProps> = ({ userDetails }) => {
  const { user, error, isLoading } = useUser();
  const [userRole, setUserRole] = useState('');
  const roleStore = useRole();

  const {
    data: role,
    error: roleError,
    isLoading: roleLoading,
  }: { data: string; error: any; isLoading: any } = useSWR(
    `/api/role`,
    fetcher,
    {
      revalidateIfStale: true,
    }
  );

  useEffect(() => {
    if (role != localStorage.getItem('role')) {
      localStorage.setItem('role', role);
      setUserRole(role);
      roleStore.onUpdate(role);
    }
  }, [role]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div className=" hidden lg:flex items-center justify-center h-full">
      <h1 className="font-semibold  mr-2">Signed In as:</h1>
      <h2>
        {user?.name} - ({userRole}){' '}
      </h2>
    </div>
  );
};

export default Details;
