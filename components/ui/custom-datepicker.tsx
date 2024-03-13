'use client';

import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';

import Datepicker from 'tailwind-datepicker-react';

interface NextDatePickerProps {
  value: Date;
  onChange: () => void;
  minDate?: Date;
  maxDate: Date;
}

const NextDatePicker = ({
  maxDate,
  minDate,
  value,
  onChange,
}: NextDatePickerProps) => {
  const [show, setShow] = useState(false);

  return (
    <Datepicker
      options={{
        autoHide: true,
        todayBtn: false,
        clearBtn: true,
        clearBtnText: 'Clear',
        maxDate: maxDate,
        minDate: minDate ? minDate : new Date('1640/01/01'),
        theme: {
          background: 'bg-background ',
          todayBtn: '',
          clearBtn: '',
          icons: '',
          text: 'font-normal',
          disabledText: 'text-slate-400',
          input: '',
          inputIcon: 'text-gray-500 h-4',
          selected: 'bg-primary',
        },
        // icons: {
        // 	// () => ReactElement | JSX.Element
        // 	prev: () => <span>Previous</span>,
        // 	next: () => <span>Next</span>,
        // },
        datepickerClassNames: 'bottom-10',
        defaultDate: value ? new Date(value) : new Date(),
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
      }}
      onChange={onChange}
      show={show}
      setShow={() => setShow(false)}
    >
      <div className="flex items-center  h-10 w-full rounded-md border border-input bg-background  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-row-reverse justify-between hover:cursor-pointer hover:bg-slate-100 transition-all duration-300 ease-in-out">
        <CalendarIcon className="h-4 w-4 mr-5 opacity-50" />

        <input
          type="text"
          placeholder="Select Date"
          value={new Date(value).toDateString()}
          onClick={() => setShow(!show)}
          readOnly
          className="w-full px-3 py-2 h-full focus-visible:outline-none hover:cursor-pointer bg-transparent"
        />
      </div>
    </Datepicker>
  );
};

export default NextDatePicker;
