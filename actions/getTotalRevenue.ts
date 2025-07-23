import { InvoiceColumn } from '@/app/(dashboard)/invoices/components/columns';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';

export const getTotalRevenue = async () => {
  const arrangements = await prismadb.arrangement.findMany({
    where: {
      deceased: {
        flagDelete: false,
      },
      created: {
        gte: new Date(new Date(new Date().getFullYear(), 0, 1)),
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
      created: {
        gte: new Date(new Date(new Date().getFullYear(), 0, 1)),
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

  const invoices = await prismadb.invoice.findMany({
    orderBy: {
      created: 'desc',
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

  const formattedInvoices: InvoiceColumn[] = invoices.map((item) => ({
    id: item.id,
    type: 'Custom',
    deceasedId: item.id,
    receiptNo: item.invoiceNo,
    memberNo: 'N/A',
    name: item.customerDetails.firstName + ' ' + item.customerDetails.lastName,
    dateOfDeath: 'N/A',
    paidUp: item.paidUp,
    idNumber: 'N/A',
    outstanding: item.total,
    amountDue: item.total,
    created: item.created,
  }));

  const formattedItems: InvoiceColumn[] = formattedArrangements.concat(
    formattedRemovals,
    formattedInvoices
  );

  const totalPayments: any = formattedItems.reduce((total, order) => {
    if (
      order.paidUp &&
      new Date(order.created).getFullYear() == new Date().getFullYear()
    ) {
      return total + order.amountDue;
    } else {
      return total;
    }
  }, 0);

  return totalPayments;
};
