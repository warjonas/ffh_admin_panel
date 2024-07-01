import prismadb from '@/lib/prismadb';
import { TableData } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { catId: string } }
) {
  try {
    const subCats = await prismadb.subExpCategory.findMany({
      where: {
        expCategory: {
          id: params.catId,
        },
      },
    });

    const expenses = await prismadb.expense.findMany({});

    const tableData: TableData[] = subCats.map((item) => ({
      id: item.id,
      category: item.name,
      month: [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
      ],
    }));

    subCats.map((sub) => {
      const monthlyExpense: { [key: number]: number } = {};

      for (const exp of expenses) {
        const month = exp.createdOn.getMonth();
        let amount = 0;

        if (exp.subCatId == sub.id) {
          amount = exp.cost;
          monthlyExpense[month] = (monthlyExpense[month] || 0) + amount;
        }
      }

      for (const month in monthlyExpense) {
        const index = tableData.map((i) => i.category).indexOf(sub.name);
        tableData[index].month[month].total = monthlyExpense[parseInt(month)];
      }
    });

    return NextResponse.json(tableData);
  } catch (error) {
    console.log('STATS_SUBEXP_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
