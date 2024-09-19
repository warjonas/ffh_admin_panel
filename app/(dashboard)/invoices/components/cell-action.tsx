'use client';

import { useCallback, useState } from 'react';
import {
  Copy,
  DollarSign,
  Edit,
  MoreHorizontal,
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

import { InvoiceColumn } from './columns';
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
import { InvoiceModal } from './invoice-modal';
import { useRemovalReceiptModal } from '@/hooks/use-removal-modal';
import { useProcessPaymentModal } from '@/hooks/use-payment-modal';
import { useArrangeInvoice, useInvoice } from '@/hooks/use-invoice-modal';

interface CellActionProps {
  data: InvoiceColumn;
  deceasedId: string;
}

interface QueryProps {
  name: string;
  value: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, deceasedId }) => {
  const [open, setOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const receiptModal = useRemovalReceiptModal();
  const useArrangeInvoiceModal = useArrangeInvoice();
  const useInvoiceModal = useInvoice();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const processPaymentModal = useProcessPaymentModal();

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

  const onUpdate = async () => {
    switch (data.type) {
      case 'Arrangement':
        router.push(`/arrangments/${data.id}`);

        break;
      case 'Custom':
        router.push(`/invoices/${data.receiptNo}`);
        break;
      case 'Removal':
        router.push(`/removals/${data.id}`);

        break;
      default:
        break;
    }
  };

  const onConfirm = async () => {
    setLoading(true);

    switch (data.type) {
      case 'Arrangement':
        router.push(`/arrangement/${data.id}`);
        break;
      case 'Custom':
        router.push(`/invoice/${data.receiptNo}`);
        break;
      case 'Removal':
        router.push(`/removal/${data.id}`);

        break;

      default:
        break;
    }

    router.push(`/arrangements/${data.id}`);

    setLoading(false);
    setOpen(false);
  };

  const registerPayment = async () => {
    setLoading(true);

    switch (data.type) {
      case 'Arrangement':
        router.push(`/invoices/?type=arrangement&arrangementId=${data.id}`);
        break;
      case 'Custom':
        router.push(`/invoices/?type=custom&invoiceId=${data.receiptNo}`);
        break;
      case 'Removal':
        router.push(`/removals/?type=removal&removalId=${data.id}`);

        break;

      default:
        break;
    }

    processPaymentModal.onOpen();
  };

  return (
    <>
      {/* <InvoiceModal
        isOpen={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        id={data.receiptNo}
      /> */}

      {/* <InfoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        id={deceasedId}
      /> */}
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
          <DropdownMenuItem
            onClick={() =>
              data.type == 'Custom'
                ? useInvoiceModal.onOpen(data.receiptNo)
                : useArrangeInvoiceModal.onOpen(data.deceasedId)
            }
          >
            <View className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdate()}>
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>

          {!data.paidUp && (
            <DropdownMenuItem onClick={() => registerPayment()}>
              <DollarSign className="mr-2 h-4 w-4" />
              Register Payment
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setAlertOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
