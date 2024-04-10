import { InvoiceColumn } from '@/app/(dashboard)/invoices/components/columns';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async () => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
    },
    include: {
      deceased: true,
    },
    orderBy: {
      deceased: {
        dateOfDeath: 'desc',
      },
    },
  });

  const removals = await prismadb.removal.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
    },
    include: {
      deceased: true,
    },
    orderBy: {
      deceased: {
        dateOfDeath: 'desc',
      },
    },
  });

  const formattedRemovals: InvoiceColumn[] = removals.map((item) => ({
    id: item.id,
    type: 'Removal',
    deceasedId: item.deceasedId,
    receiptNo: item.invoiceNo,
    memberNo: item.deceased.ffhMemberNo,
    name: item.deceased.firstNames + ' ' + item.deceased.lastName,
    dateOfDeath: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
    paidUp: item.paidUp,
    idNumber: item.deceased.idNumber,
    outstanding: item.outstandingBalance,
    amountDue: item.totalDue,
    created: item.created,
  }));

  const formattedArrangements: InvoiceColumn[] = arrangements.map((item) => ({
    id: item.id,
    type: 'Arrangement',
    deceasedId: item.deceasedId,
    receiptNo: item.invoiceNo,
    memberNo: item.deceased.ffhMemberNo,
    name: item.deceased.firstNames + ' ' + item.deceased.lastName,
    dateOfDeath: format(item.deceased.dateOfDeath, 'MM/dd/yyyy'),
    paidUp: item.paidUp,
    idNumber: item.deceased.idNumber,
    outstanding: item.outstandingBalance,
    amountDue: item.totalDue,
    created: item.created,
  }));

  const formattedItems: InvoiceColumn[] =
    formattedArrangements.concat(formattedRemovals);

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of formattedItems) {
    const month = order.created.getMonth();
    let revenForOrder = 0;

    if (order.paidUp) {
      revenForOrder = order.amountDue;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenForOrder;
  }

  const graphData: GraphData[] = [
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
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};
