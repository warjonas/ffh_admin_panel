import { InvoiceColumn } from '@/app/(dashboard)/invoices/components/columns';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';

export interface GraveDataType {
  name: string;
  total: number;
  colour: string;
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

export const getGraveStats = async () => {
  const graves = await prismadb.grave.findMany({
    take: 4,
    include: {
      arrangements: true,
    },
    orderBy: {
      graveName: 'asc',
    },
  });

  const graphData: GraveDataType[] = [];

  for (const grave of graves) {
    const cememetry = grave.graveName;
    let services = 0;

    if (grave.arrangements) {
      services = grave.arrangements.length;
    }

    graphData.push({
      name: grave.graveName,
      total: services ? services : 0,
      colour: randDarkColor(),
    });
  }

  return graphData;
};
