import Link from 'next/link';
import React from 'react';
import MainNavActions from './main-nav-actions';

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="w-64 bg-slate-100 h-screen text-primary shadow-lg rounded-r-lg bg-opacity-80 p-5 flex flex-col justify-between">
      <section>Header</section>
      <section>
        <MainNavActions />
      </section>
      <section>Footer</section>
    </div>
  );
};

export default Sidebar;
