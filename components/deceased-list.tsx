// import { PopoverTriggerProps } from '@radix-ui/react-popover';
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

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface DeceasedListProps extends PopoverTriggerProps {
  items: any;
}

const StoreSwitcher = ({ className, items = [] }: DeceasedListProps) => {
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

  const formattedItems = items.map((item: Deceased) => ({
    label: item.firstNames + ' ' + item.lastName,
    value: item.id,
  }));

  const deceasedDetails = formattedItems.find((item: any) => item.value === id);

  const [open, setOpen] = useState(false);

  const onDeceasedSelect = (id: string) => {
    router.push(pathname + '?' + createQueryString('deceasedId', id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select Store"
          className={cn('w-fit px-5 justify-between h-11 text-xl', className)}
        >
          <StoreIcon className="mr-2 h-5 w-5" />
          {deceasedDetails?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No Deceased found</CommandEmpty>
            <CommandGroup heading="Deceased">
              {formattedItems.map((item: any) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onDeceasedSelect(item.value)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-4 text-white" /> {item.value}{' '}
                  <Check
                    className={cn(
                      'ml-2 h-4 w-4',
                      deceasedDetails?.value === id
                        ? 'opacity-100'
                        : 'opacity-0'
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
                  deceasedModal.onOpen();
                }}
                className="hover:cursor-pointer"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
