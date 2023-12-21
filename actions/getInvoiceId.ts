import { randomInt } from 'crypto';

export const generateId = async () => {
  const d = new Date();
  const i = await randomInt(99);
  const month = d.getMonth() + 1;

  const invoiceId =
    'INV-' +
    d.getDate().toString() +
    month.toString() +
    d.getFullYear().toString() +
    '-' +
    d.getHours().toString() +
    i.toString();

  return invoiceId;
};
