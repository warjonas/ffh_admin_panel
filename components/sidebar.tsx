import Link from 'next/link';
import React from 'react';
import MainNavActions from './main-nav-actions';
import SidebarFooter from './sidebar-footer';
import SidebarHeader from './sidebar-header';

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="w-fit lg:w-64 bg-foreground h-screen text-primary-foreground shadow-lg rounded-r-lg bg-opacity-80  flex flex-col justify-between">
      <section className=" hidden lg:flex flex-col items-center justify-center h-56 bg-background rounded-b-[50%] text-secondary-foreground">
        <SidebarHeader />
        <h1 className="mt-5 text-2xl font-semibold text-center">
          Fortuin Funeral <br /> Home
        </h1>
        <p className="">Admin Panel</p>
      </section>
      <section className="p-5">
        <MainNavActions />
      </section>
      <section className="p-5">
        <SidebarFooter />
      </section>
    </div>
  );
};

export default Sidebar;
