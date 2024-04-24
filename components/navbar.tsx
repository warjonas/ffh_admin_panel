import React from 'react';
import { Button } from './ui/button';
import { LogOutIcon } from 'lucide-react';
import MainNavActions from './main-nav-actions';
import Details from './details';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="h-14 p-2 shadow-md bg-background flex justify-between sticky top-0">
      <section className="flex">
        <MainNavActions />
      </section>
      <section className="flex gap-2">
        <Details />
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
