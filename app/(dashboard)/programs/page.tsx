import Heading from '@/components/ui/heading';
import React, { Suspense } from 'react';
import HeaderOptions from '@/components/ui/header-options';
import { FuneralClient } from './components/client';
import prismadb from '@/lib/prismadb';
import { FuneralProgramColumn } from './components/columns';
import { format } from 'date-fns';
import Loading from '../Loading';

type Props = {};

const Programs = async (props: Props) => {
  const funeralPrograms = await prismadb.funeralProgram.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
    },
    include: {
      deceased: {
        include: {
          arrangement: true,
        },
      },
    },
  });

  const formattedPrograms: FuneralProgramColumn[] = funeralPrograms.map(
    (program) => ({
      id: program.id,
      name: program.deceased.firstNames + ' ' + program.deceased.lastName,
      idNumber: program.deceased.idNumber,
      dateOfFuneral: program.deceased.arrangement?.dateOfFuneralService
        ? format(
            program.deceased.arrangement.dateOfFuneralService,
            'MM/dd/yyyy'
          )
        : 'Not available',

      createdBy: program.createdBy,
      dateOfBirth: format(program.deceased.dateOfBirth, 'MM/dd/yyyy'),
      language: program.languageOfProgram,

      dateOfDeath: format(program.deceased.dateOfDeath, 'MM/dd/yyyy'),
    })
  );

  return (
    <section className="p-5 w-full h-full">
      <Suspense fallback={<Loading />}>
        <Heading
          title="Funeral Progams"
          subtitle="Manage programs for upcoming funerals"
        />
        {/* <section>
        <div className="flex justify-between">
          <HeaderOptions title="New Funeral Program" link="deceased" />
        </div>
      </section> */}
        <section>
          <FuneralClient data={formattedPrograms} />
        </section>
      </Suspense>
    </section>
  );
};

export default Programs;
