'use client';

import React, { useCallback, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { Deceased } from '@prisma/client';
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

interface BodyRemovalListProps extends PopoverTriggerProps {
  items: Removal[];
  disabled: boolean;
}

const BodyRemovalList = ({
  className,
  items = [],
  disabled,
}: BodyRemovalListProps) => {
  const deceasedModal = useDeceasedModal();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const id = searchParams.get('removalId');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const formattedItems = items.map((item: Removal) => ({
    label: item.deceased.firstNames + ' ' + item.deceased.lastName,
    value: item.id,
    receiptNo: item.deceased.idNumber,
  }));

  const removalDetails = formattedItems.find((item: any) => item.value === id);

  const [open, setOpen] = useState(false);

  const onDeceasedSelect = (id: string) => {
    router.push(pathname + '?' + createQueryString('removalId', id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select removal"
          className={cn('w-1/2 p-2 justify-between text-lg', className)}
        >
          {removalDetails?.label} - {removalDetails?.receiptNo}
          <ChevronsUpDown className="ml-2  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Deceased..." />
            <CommandEmpty>No Invoice found</CommandEmpty>
            <CommandGroup heading="Deceased">
              {formattedItems.map((item: any) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => {
                    onDeceasedSelect(item.value);
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

export default BodyRemovalList;
