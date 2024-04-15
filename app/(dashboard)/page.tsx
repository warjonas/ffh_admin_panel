import Image from 'next/image';
import React from 'react';

import underContruction from '@/assets/220880-P1KV8M-746.jpg';
import Heading from '@/components/ui/heading';
import { CreditCard, DollarSign, LineChart, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatter } from '@/lib/utils';
import { Overview } from '@/components/ui/overview';
import { getGraphRevenue } from '@/actions/getGraphRevenue';
import { getTotalRevenue } from '@/actions/getTotalRevenue';
import { getOutstandingBal } from '@/actions/getOutstandingBal';
import { getUpcomingFunerals } from '@/actions/getUpcomingFunerals';
import { format } from 'date-fns';
import PieChartOverview from '@/components/ui/piechart';
import { getGraveStats } from '@/actions/getGraveStats';
import { getPastFunerals } from '@/actions/getPastFunerals';
import { getPopularCoffin } from '@/actions/getPopularCoffin';

type Props = {};

const Home = async (props: Props) => {
  const totalRevenue = await getTotalRevenue();
  const outstanding = await getOutstandingBal();

  const upcomingFunerals = await getUpcomingFunerals();
  const pastFunerals = await getPastFunerals();
  const graveStats = await getGraveStats();
  const popCoffin = await getPopularCoffin();

  const graphRevenue = await getGraphRevenue();

  return (
    <section className="p-5 w-full h-full flex-col justify-between gap-y-4">
      <Heading title="Dashboard" subtitle="Overview of business performance" />

      <section className="grid gap-4 grid-cols-4 mb-4 h-[20%]">
        <Card className="col-start-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>{' '}
            <DollarSign className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />

          <CardContent>
            <div className="flex flex-col w-full font-semibold">
              <h1 className="text-2xl">{formatter.format(totalRevenue)}</h1>

              <span className="text-muted-foreground text-sm">YTD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-start-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Outstanding Payments</CardTitle>{' '}
            <CreditCard className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />
          <CardContent>
            <div className="flex flex-col w-full font-semibold">
              <h1 className="text-2xl"> {formatter.format(outstanding)}</h1>
              <span className="text-muted-foreground text-sm">YTD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-start-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Funerals To Date</CardTitle>{' '}
            <LineChart className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />
          <CardContent>
            <div className="text-2xl font-semibold">{pastFunerals.length}</div>
          </CardContent>
        </Card>
        <Card className="col-start-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Most Popular Coffin</CardTitle>{' '}
            <Star className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />
          <CardContent>
            <div className="text-2xl font-semibold text-primary">
              {popCoffin[0].coffinName +
                ' ' +
                `(${popCoffin[0].arrangements.length})`}
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-4 gap-4 h-auto">
        <Card className="col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardDescription className="px-6">
            Financial Overview of the year
          </CardDescription>
          <hr className="w-[95%] mx-6 my-2 justify-self-center self-center" />
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
        <Card className="col-start-3 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Upcoming Funerals</CardTitle>
          </CardHeader>
          <CardDescription className="px-6">
            Funerals happening this week
          </CardDescription>
          <hr className="w-[90%] mx-6 my-5 justify-self-center self-center" />
          <CardContent className="px-6">
            {upcomingFunerals.map((funeral) => (
              <div
                key={funeral.id}
                className="justify-between flex flex-row gap-y-5 mb-4 pb-2 border-b"
              >
                <p className="font-medium text-lg">
                  {funeral.deceased.firstNames +
                    ' ' +
                    funeral.deceased.lastName}
                </p>
                {funeral.dateOfFuneralService && (
                  <p className="font-medium text-lg">
                    {format(
                      new Date(funeral.dateOfFuneralService),
                      'dd/MM/yyyy'
                    )}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-start-4 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Most used Cemetries</CardTitle>
          </CardHeader>
          <CardDescription className="px-6">
            Frequently used cemetry to date
          </CardDescription>
          <hr className="w-[95%] mx-6 my-2 justify-self-center self-center" />
          <CardContent className="pl-2 w-full">
            <PieChartOverview data={graveStats} />
          </CardContent>
        </Card>
      </section>
    </section>
  );
};

export default Home;
