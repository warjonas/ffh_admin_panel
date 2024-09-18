'use client';

import React, { useCallback, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { Deceased, Invoice } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Removal } from '@/types';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface InvoiceListProps extends PopoverTriggerProps {
  items: Invoice[];
  disabled: boolean;
}

const InvoiceList = ({ className, items = [], disabled }: InvoiceListProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const id = searchParams.get('invoiceId');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const filteredItems = items.filter((item: Invoice) => item.paidUp !== true);

  const formattedItems = filteredItems.map((item: Invoice) => ({
    label: item.customerDetails.firstName + ' ' + item.customerDetails.lastName,
    value: item.invoiceNo,
    receiptNo: item.invoiceNo,
  }));

  const invoiceDetails = formattedItems.find((item: any) => item.value === id);

  const [open, setOpen] = useState(false);

  const onInvoiceSelect = (id: string) => {
    router.push(pathname + '?' + createQueryString('invoiceId', id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select Invoice"
          className={cn('w-1/2 p-2 justify-between text-lg', className)}
        >
          {invoiceDetails?.label} - {invoiceDetails?.receiptNo}
          <ChevronsUpDown className="ml-2  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Invoice..." />
            <CommandEmpty>No Invoice found</CommandEmpty>
            <CommandGroup heading="Deceased">
              {formattedItems.map((item: any) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onInvoiceSelect(item.value);
                    setOpen(!open);
                  }}
                  className="text-sm"
                >
                  {item.label} - {item.receiptNo}
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4',
                      item.value === id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default InvoiceList;
