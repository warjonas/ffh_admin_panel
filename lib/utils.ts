import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { generateComponents } from '@uploadthing/react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'ZAR',
});
