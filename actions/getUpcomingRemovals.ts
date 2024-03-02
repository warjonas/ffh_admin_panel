'use server';

// import prismadb from '@/lib/prismadb';

export const calculate_days = async (date1: Date, date2: Date) => {
  let timeDifference = date2.getTime() - date1.getTime();

  let days = Math.round(timeDifference / (1000 * 3600 * 24));

  return days;
};
