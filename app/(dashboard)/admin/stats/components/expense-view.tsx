import { getExpenses } from '@/actions/getExpenses';
import { getPopularExpCat } from '@/actions/getPopularExpCat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { Expense } from '@prisma/client';
import { DollarSign } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';
import { ExpenseColumns } from './columns/expense-columns';
import { ExpenseClient } from './clients/expense-client';

interface ExpenseViewProps {
  data: Expense[];
  tableData: any[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ExpenseView = ({ data, tableData }: ExpenseViewProps) => {
  const totalExpenses = data.reduce((total, order) => {
    return total + order.cost;
  }, 0);

  const {
    data: popCat,
    error: initialDataError,
    isLoading: initialDataLoading,
  } = useSWR('/api/stats/popCat', fetcher, {
    revalidateIfStale: true,
  });

  const {
    data: mostRec,
    error: mostRecError,
    isLoading: mostRecLoading,
  } = useSWR('/api/stats/mostRecExp', fetcher, {
    revalidateIfStale: true,
  });

  return (
    <section className="flex flex-col w-full">
      <section className="flex flex-row w-full h-full gap-x-5">
        <Card className="w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Expenses</CardTitle>{' '}
            <DollarSign className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />

          <CardContent>
            <div className="flex flex-col w-full font-semibold">
              <h1 className="text-2xl">{formatter.format(totalExpenses)}</h1>

              <span className="text-muted-foreground text-sm">YTD</span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Popular Expense Category</CardTitle>{' '}
            <DollarSign className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />

          <CardContent>
            <div className="flex flex-col w-full font-semibold">
              <h1 className="text-2xl">
                {initialDataLoading ? 'Loading...' : popCat}
              </h1>
            </div>
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Most Recent Expense</CardTitle>{' '}
            <DollarSign className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
          </CardHeader>
          <hr className="w-[90%] mx-6 my-2 justify-self-center self-center" />

          <CardContent>
            <div className="flex flex-col w-full font-semibold">
              <h1 className="text-2xl">
                {mostRecLoading
                  ? 'Loading...'
                  : mostRec[0]?.description +
                    ' - ' +
                    formatter.format(mostRec[0].cost)}
              </h1>

              <span className="text-muted-foreground text-sm">YTD</span>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-row h-full mt-5 mb-5">
        <div className="w-3/4  h-full">
          <ExpenseClient data={tableData} />
        </div>
      </section>
    </section>
  );
};

export default ExpenseView;
