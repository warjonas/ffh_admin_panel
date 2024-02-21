import prismadb from '@/lib/prismadb';
import React from 'react';
import ProgramForm from './components/program-form';

interface Props {
  params: { programId: string };
}

const page = async ({ params }: Props) => {
  const program = await prismadb.funeralProgram.findUnique({
    where: {
      id: params.programId,
    },
    include: {
      deceased: true,
    },
  });

  return (
    <div className="min-h-screen w-full p-5 overflow-auto mb-20">
      <ProgramForm initialData={program} />
    </div>
  );
};

export default page;
