import React, { Suspense } from 'react';
import { Button } from './ui/button';
import { LogOutIcon } from 'lucide-react';
import MainNavActions from './main-nav-actions';
import Details from './details';
import { getSession } from '@auth0/nextjs-auth0';
import { getRole } from '@/actions/getRole';
import axios from 'axios';

type Props = {};

const Navbar = async (props: Props) => {
  // const data = await getSession();

  // const res = await getRole();

  return (
    <nav className="h-14 p-2 shadow-md bg-background flex justify-between sticky top-0">
      <section className="flex">
        <MainNavActions />
      </section>
      <section className="flex gap-2">
        <Suspense fallback={<div>Loading ...</div>}>
          <Details />
        </Suspense>
        <a href="/api/auth/logout">
          <Button
            variant={'outline'}
            className="w-full justify-between p-1 text-md gap-2 hover:text-background hover:bg-primary transition-all duration-200 ease-in"
          >
            <span className="lg:block hidden">Logout</span>
            <span>
              <LogOutIcon className="h-5 w-5" />
            </span>
          </Button>
        </a>
      </section>
    </nav>
  );
};

export default Navbar;
