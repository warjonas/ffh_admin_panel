import Heading from '@/components/ui/heading';
import React from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { FuneralClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { FuneralProgramColumn } from './components/columns';
import { format } from 'date-fns';

type Props = {};

const Programs = async (props: Props) => {
  const funeralPrograms = await prismadb.funeralProgram.findMany({});

  const formattedPrograms: FuneralProgramColumn[] = funeralPrograms.map(
    (program) => ({
      id: program.id,
      firstName: program.firstNameOfDeceased,
      lastName: program.lastNameOfDeceased,
      createdBy: program.createdBy,
      dateOfBirth: format(program.dateOfBirth, 'MM/dd/yyyy'),
      language: program.languageOfProgram,

      dateOfDeath: format(program.dateOfDeath, 'MM/dd/yyyy'),
    })
  );

  return (
    <section className="p-5 w-full h-full">
      <Heading
        title="Funeral Progams"
        subtitle="Create and Manage programs for upcoming funerals"
      />
      <section>
        <div className="flex justify-between">
          <HeaderOptions title="New Funeral Program" path="/programs/new" />
        </div>
      </section>
      <section>
        <FuneralClient data={formattedPrograms} />
      </section>
    </section>
  );
};

export default Programs;
