import { InvoiceColumn } from '@/app/(dashboard)/invoices/components/columns';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';

interface GraphData {
  colour: string;
  name: string;
  total: number;
}

function randDarkColor() {
  var lum = -0.25;
  var hex = String(
    '#' + Math.random().toString(16).slice(2, 8).toUpperCase()
  ).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }
  return rgb;
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
    { colour: randDarkColor(), name: 'Jan', total: 0 },
    { colour: randDarkColor(), name: 'Feb', total: 0 },
    { colour: randDarkColor(), name: 'Mar', total: 0 },
    { colour: randDarkColor(), name: 'Apr', total: 0 },
    { colour: randDarkColor(), name: 'May', total: 0 },
    { colour: randDarkColor(), name: 'Jun', total: 0 },
    { colour: randDarkColor(), name: 'Jul', total: 0 },
    { colour: randDarkColor(), name: 'Aug', total: 0 },
    { colour: randDarkColor(), name: 'Sep', total: 0 },
    { colour: randDarkColor(), name: 'Oct', total: 0 },
    { colour: randDarkColor(), name: 'Nov', total: 0 },
    { colour: randDarkColor(), name: 'Dec', total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};
