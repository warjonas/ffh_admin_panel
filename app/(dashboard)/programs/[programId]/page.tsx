import prismadb from '@/lib/prismadb';
import React from 'react';
import ProgramForm from './components/program-form';

interface Props {
  params: { programId: string };
}

const page = async ({ params }: Props) => {
  let program = null;

  if (params.programId !== 'new') {
    program = await prismadb.funeralProgram.findUnique({
      where: {
        id: params.programId,
      },
    });
  }

  return (
    <div className="min-h-screen w-full p-5 overflow-auto mb-20">
      <ProgramForm initialData={program} />
    </div>
  );
};

export default page;
