'use client';

import React, { useCallback, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react';

import { Deceased } from '@/types';
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
import { Arrangement } from '@prisma/client';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface DeceasedListProps extends PopoverTriggerProps {
  items: any;
  disabled: boolean;
}

const DeceasedList = ({
  className,
  items = [],
  disabled,
}: DeceasedListProps) => {
  const deceasedModal = useDeceasedModal();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const id = searchParams.get('deceasedId');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const filteredItems = items.filter(
    (item: Deceased & Arrangement) =>
      item.arrangement == null && item.removal == null
  );

  const formattedItems = filteredItems.map((item: Deceased) => ({
    label: item.firstNames + ' ' + item.lastName,
    value: item.id,
    idNumber: item.idNumber,
  }));

  const deceasedDetails = formattedItems.find((item: any) => item.value === id);

  const [open, setOpen] = useState(false);

  const onDeceasedSelect = (id: string) => {
    router.push(pathname + '?' + createQueryString('deceasedId', id));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select Store"
          className={cn(
            'min-w-[50%] w-fit p-2 justify-between text-lg',
            className
          )}
        >
          {deceasedDetails?.label} - {deceasedDetails?.idNumber}
          <ChevronsUpDown className="h-4 w-4 ml-2  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Deceased..." />
            <CommandEmpty>No Deceased found</CommandEmpty>
            <CommandGroup heading="Deceased">
              {formattedItems.map((item: any) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onDeceasedSelect(item.value)}
                  className="text-sm"
                >
                  {item.label} - {item.idNumber}
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
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push('/deceased');
                  deceasedModal.onOpen();
                }}
                className="hover:cursor-pointer"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add deceased
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DeceasedList;
