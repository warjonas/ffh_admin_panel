'use client';

import { useCallback, useState } from 'react';
import { Copy, Edit, MoreHorizontal, ScanEye, Trash, View } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import axios from 'axios';

import { BodyRemovalColumn } from './columns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  useRemovalInfoModal,
  useRemovalModal,
} from '@/hooks/use-removal-modal';

interface CellActionProps {
  data: BodyRemovalColumn;
  deceasedId: string;
}

interface QueryProps {
  name: string;
  value: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, deceasedId }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const infoModal = useRemovalInfoModal();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const removalModal = useRemovalModal();

  const createQueryString = useCallback(
    (queries: QueryProps[]) => {
      const params = new URLSearchParams(searchParams.toString());

      queries.map((query) => {
        params.set(query.name, query.value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/removal/${data.id}`);
      router.refresh();
      toast.success('Body removal record has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  const onView = () => {
    const query: QueryProps[] = [{ name: 'removalId', value: data.id }];
    router.push('/removals');

    router.push(pathname + '?' + createQueryString(query));
    infoModal.onOpen();
  };

  const onUpdate = async () => {
    const query: QueryProps[] = [
      { name: 'deceasedId', value: deceasedId },
      { name: 'removalId', value: data.id },
    ];

    router.push(`/removals/${data.id}`);
  };

  const onPreview = () => {
    const query: QueryProps[] = [
      { name: 'removalId', value: data.id },
      { name: 'preview', value: 'removal' },
    ];

    router.push(pathname + '?' + createQueryString(query));
  };

  return (
    <>
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
          <DropdownMenuItem onClick={onView}>
            <View className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onPreview}>
            <ScanEye className="mr-2 h-4 w-4" />
            Preview
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
