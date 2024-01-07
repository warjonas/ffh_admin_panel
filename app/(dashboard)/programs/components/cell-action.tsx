'use client';

import { useState } from 'react';
import { Copy, Edit, MoreHorizontal, Trash, View } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

import { FuneralProgramColumn } from './columns';
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

interface CellActionProps {
  data: FuneralProgramColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/program/${data.id}`);
      router.refresh();
      toast.success('Funeral Program has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  const onConfirm = async () => {
    setLoading(true);
    router.push(`/programs/${data.id}`);

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
          <DropdownMenuItem onClick={() => router.push(`/programs/${data.id}`)}>
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
