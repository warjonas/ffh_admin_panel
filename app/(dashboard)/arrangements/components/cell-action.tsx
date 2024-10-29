'use client';

import { useCallback, useState } from 'react';
import {
  CircleDollarSign,
  Copy,
  Edit,
  MoreHorizontal,
  Receipt,
  ScanEye,
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

import { ArrangementColumn } from './columns';
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
import { useArrangementModal } from '@/hooks/use-arrangement-modal';
import { useProcessPaymentModal } from '@/hooks/use-payment-modal';
import { useArrangeInvoice } from '@/hooks/use-invoice-modal';

interface CellActionProps {
  data: ArrangementColumn;
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
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const arrangementModal = useArrangementModal();
  const processPaymentModal = useProcessPaymentModal();
  const useArrangeInvoiceModal = useArrangeInvoice();

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
      await axios.delete(`/api/arrangement/${data.id}`);
      router.refresh();
      toast.success('Funeral arrangement has been deleted');
    } catch (error) {
      toast.error('Internal Error');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  const setQueryParams = () => {
    const query: QueryProps[] = [
      { name: 'deceasedId', value: deceasedId },
      { name: 'arrangementId', value: data.id },
    ];

    return query;
  };

  const onView = async () => {
    const query = setQueryParams();
    router.push(pathname + '?' + createQueryString(query));
    setOpen(true);
  };

  const onUpdate = async () => {
    router.push(`/arrangements/${data.id}`);
  };

  const onConfirm = async () => {
    setLoading(true);
    router.push('/arrangements');
    router.push(`/arrangements/${data.id}`);

    setLoading(false);
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
    router.back();
  };

  const onPayment = () => {
    const query: QueryProps[] = [
      { name: 'type', value: 'arrangement' },
      { name: 'arrangementId', value: `${data.id}` },
    ];

    router.push(pathname + '?' + createQueryString(query));

    processPaymentModal.onOpen();
  };

  const onPreview = () => {
    const query: QueryProps[] = [
      { name: 'arrangementId', value: data.id },
      { name: 'deceasedId', value: deceasedId },

      { name: 'preview', value: 'arrangement' },
    ];

    router.push(pathname + '?' + createQueryString(query));
  };

  const viewInvoice = () => {
    const query: QueryProps[] = [
      { name: 'arrangementId', value: data.id },
      { name: 'deceasedId', value: deceasedId },

      { name: 'preview', value: 'arrangement' },
    ];
  };

  return (
    <>
      <InfoModal
        isOpen={open}
        onClose={onClose}
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
          <DropdownMenuItem onClick={onView}>
            <View className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdate()}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPreview}>
            <ScanEye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useArrangeInvoiceModal.onOpen(data.deceasedId)}
          >
            <CircleDollarSign className="mr-2 h-4 w-4" />
            View Invoice
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onPayment}>
            <Receipt className="mr-2 h-4 w-4" />
            Register Payment
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
