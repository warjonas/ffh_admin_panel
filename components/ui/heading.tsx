import React from 'react';

interface HeadingProps {
  title: string;
  subtitle: string;
}

const Heading = ({ title, subtitle }: HeadingProps) => {
  return (
    <div className="w-full text-primary">
      <h1 className="text-3xl font-semibold mb-2">{title}</h1>
      <p className="mb-2 text-xl">{subtitle}</p>
      <hr className="my-5 w-full border-primary border-slate-200" />
    </div>
  );
};

export default Heading;
