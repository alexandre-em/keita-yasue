'use client';
import { Ban, CircleCheckBig, CircleX, Loader } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TransactionsServiceIns } from '@/services';

type CancelTransactionDialogProps = {
  id: string;
  status: StatusType;
};

export default function CancelTransactionDialog({ id, status }: CancelTransactionDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (id) {
      setLoading(true);
      // If admin already validated reservation, ask for cancellation
      // Otherwise, it delete it definitively
      const cancelPromise =
        status === 'VALIDATED'
          ? TransactionsServiceIns.updateOne(id, {
              status: 'TO_CANCEL',
              updatedAt: new Date(),
            })
          : TransactionsServiceIns.deleteOne(id);

      cancelPromise
        .then((data) => {
          if (data) {
            toast('Status updated', {
              description: id,
              icon: <CircleCheckBig />,
            });
          } else {
            toast('An error occurred', {
              description: 'Could not cancelled the transaction. Please try again later',
              icon: <CircleX />,
            });
          }
        })
        .catch(() => {
          toast('An error occurred', {
            description: 'Could not cancelled the transaction. Please try again later',
            icon: <CircleX />,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, status]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-1" variant="destructive">
          <Ban className="mr-2" />
          Cancel my transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel my transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription>Are you sure to cancel your transaction ?</DialogDescription>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} variant="destructive">
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2 animate-spin" /> Submitting...
              </div>
            ) : (
              'Cancel'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
