'use client';

import { Button } from '@/components/ui/button';
import { useCoffinModal, useGraveModal } from '@/hooks/use-deceased-modal';
import { formatter } from '@/lib/utils';
import { Coffin, Grave } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { Pencil, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR, { SWRConfiguration } from 'swr';

type Props = {};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface QueryProps {
  name: string;
  value: string;
}

const Users = (props: Props) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (queries: QueryProps[]) => {
      const params = new URLSearchParams(searchParams.toString());
      queries.map((query) => {
        params.set(query.name, query.value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const config: SWRConfiguration = {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
  };

  const { data, error, isLoading }: { data: any; error: any; isLoading: any } =
    useSWR(`/api/user`, fetcher);

  return (
    <section className="w-full flex flex-row">
      {/* list of users */}

      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold">Manage Users</h1>
          {/* <Button onClick={addGraveModal.onOpen}> Add new grave site</Button> */}
        </div>
        <hr className="w-full my-3" />
        {isLoading ? (
          <div> Loading</div>
        ) : (
          <div className="flex flex-col gap-5 w-full">
            {data ? (
              data.map((user: any) => (
                <div
                  className=" grid grid-cols-6 flex-row w-full justify-between  border-b pb-2 gap-y-2 items-center"
                  key={user.email}
                >
                  <h2 className="font-medium col-start-1">
                    Full Name: <br />{' '}
                    <span className="font-normal">{user.name}</span>
                  </h2>{' '}
                  <h2 className="font-medium col-start-2 col-span-2">
                    Email: <br />{' '}
                    <span className="font-normal">{user.email}</span>
                  </h2>{' '}
                  <h2 className="font-medium col-start-4">
                    Username: <br />
                    <span className="font-normal">{user.username}</span>
                  </h2>
                  <h2 className="font-medium col-start-5">
                    Role: <br />
                    <span className="font-normal">
                      {user.app_metadata.user_role}
                    </span>
                  </h2>
                  <h2 className="font-medium col-start-6">
                    Last logged In: <br />
                    <span className="font-normal">
                      {format(new Date(user.last_login), 'dd/MM/yyyy')}
                    </span>
                  </h2>
                  <X className="h-6 w-6 bg-red-900 text-background rounded-full col-start-7 justify-center ml-20 mr-20 hover:cursor-pointer" />
                </div>
              ))
            ) : (
              <h2 className="text-black">No Users available</h2>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
