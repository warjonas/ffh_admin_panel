'use client';

import { useCallback, useState } from 'react';
import {
  Car,
  Copy,
  Edit,
  Link,
  MoreHorizontal,
  Trash,
  View,
} from 'lucide-react';
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

import { Deceased } from '@prisma/client';
import {
  useDeceasedInfoModal,
  useDeceasedModal,
  useRegisterDeathModal,
} from '@/hooks/use-deceased-modal';
import { useRemovalModal } from '@/hooks/use-removal-modal';

interface CellActionProps {
  data: DeceasedColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const deceasedModal = useDeceasedModal();
  const infoModal = useDeceasedInfoModal();
  const removalModal = useRemovalModal();
  const registrationModal = useRegisterDeathModal();

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
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
    router.push(`/deceased/${data.id}`);
  };

  const onView = async () => {
    router.push(pathname + '?' + createQueryString('deceasedId', data.id));

    infoModal.onOpen();
  };

  const onRemoval = async () => {
    router.push(pathname + '?' + createQueryString('deceasedId', data.id));

    infoModal.onOpen();
  };
  const onRegistration = async () => {
    router.push(pathname + '?' + createQueryString('deceasedId', data.id));

    registrationModal.onOpen();
  };

  const generateLink = async () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_LINK_URL + data.id);
    toast.success('Funeral Program Link copied to clipboard');
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
          <DropdownMenuItem onClick={() => onView()}>
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
          <DropdownMenuItem onClick={() => onRegistration()}>
            <Car className="mr-2 h-4 w-4" />
            Register Death
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => generateLink()}>
            <Link className="mr-2 h-4 w-4" />
            Copy Program Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
