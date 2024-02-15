'use client';

import { useCallback, useState } from 'react';
import { Copy, Edit, MoreHorizontal, Trash, View } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import axios from 'axios';

import { DeceasedColumn } from './columns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InfoModal } from './info-modal';
import { AlertModal } from '@/components/modals/alert-modal';
import AddDeceasedModal from '@/components/modals/add-deceased-modal';
import useSWR, { SWRConfiguration } from 'swr';
import { Deceased } from '@prisma/client';
import { useDeceasedModal } from '@/hooks/use-deceased-modal';

interface CellActionProps {
  data: DeceasedColumn;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const deceasedModal = useDeceasedModal();

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const config: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const {
    data: deceased,
    error: dataError,
    isLoading,
  }: { data: Deceased; error: any; isLoading: any } = useSWR(
    `/api/deceased/${data.id}`,
    fetcher,
    config
  );

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/deceased/${data.id}`);
      router.refresh();
      toast.success('Deceased details have been deleted');
    } catch (error) {
      console.log(error);
      toast.error('Internal Error. Try again.');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  const onUpdate = async () => {
    router.push(pathname + '?' + createQueryString('deceasedId', data.id));
    deceasedModal.onOpen();
  };

  const onConfirm = async () => {
    setLoading(true);
    router.push(`/deceased/${data.id}`);

    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <InfoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        id={data.id}
      />
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <View className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onUpdate()}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
