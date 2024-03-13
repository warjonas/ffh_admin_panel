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
  currencyDisplay: 'narrowSymbol',
});

export const DatePickerOptions = {
  title: 'Demo Title',
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: 'Clear',
  maxDate: new Date('2030-01-01'),
  minDate: new Date('1950-01-01'),
  theme: {
    background: 'bg-gray-700 dark:bg-gray-800',
    todayBtn: '',
    clearBtn: '',
    icons: '',
    text: '',
    disabledText: 'bg-red-500',
    input: '',
    inputIcon: '',
    selected: '',
  },
  // icons: {
  // 	// () => ReactElement | JSX.Element
  // 	prev: () => <span>Previous</span>,
  // 	next: () => <span>Next</span>,
  // },
  datepickerClassNames: 'top-12',
  defaultDate: new Date('2022-01-01'),
  language: 'en',
  disabledDates: [],
  weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  inputNameProp: 'date',
  inputIdProp: 'date',
  inputPlaceholderProp: 'Select Date',
  inputDateFormatProp: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
};
