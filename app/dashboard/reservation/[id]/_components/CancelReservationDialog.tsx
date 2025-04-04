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
import { ReservationServiceIns } from '@/services';

type CancelReservationDialogProps = {
  id: string;
  status: StatusType;
};

export default function CancelReservationDialog({ id, status }: CancelReservationDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (id) {
      setLoading(true);
      // If admin already validated reservation, ask for cancellation
      // Otherwise, it delete it definitively
      const cancelPromise =
        status === 'VALIDATED'
          ? ReservationServiceIns.updateOne(id, {
              status: 'TO_CANCEL',
              updatedAt: new Date(),
            })
          : ReservationServiceIns.deleteOne(id);

      cancelPromise
        .then((data) => {
          if (!data.error) {
            toast('Status updated', {
              description: id,
              icon: <CircleCheckBig />,
            });
          } else {
            toast('An error occurred', {
              description: 'Could not updated the status',
              icon: <CircleX />,
            });
          }
        })
        .catch(() => {
          toast('An error occurred', {
            description: 'Could not updated the status',
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
          Cancel my reservation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel my reservation</DialogTitle>
        </DialogHeader>
        <DialogDescription>Are you sure to cancel your reservation ?</DialogDescription>
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
