'use client';
import { CircleCheckBig, CircleX, Loader } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type UpdateReservationStatusProps = {
  id: string;
  status: StatusType;
};

export default function UpdateReservationStatus({ id, status }: UpdateReservationStatusProps) {
  const [newStatus, setNewStatus] = useState<StatusType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (id && newStatus) {
      setLoading(true);
      const result = await fetch('/api/reservations/update', {
        method: 'POST',
        body: JSON.stringify({
          id,
          status: newStatus,
          updatedAt: new Date(),
        }),
      });

      if (result.status === 500)
        toast('An error occurred', {
          description: 'Could not updated the review',
          icon: <CircleX />,
        });
      else
        toast("Review's updated", {
          description: id,
          icon: <CircleCheckBig />,
        });

      setLoading(false);
      setOpen(false);
    }
  }, [id, newStatus]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-5 my-1">Update status</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update status</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Status
          <Select onValueChange={(v: string) => setNewStatus(v as StatusType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TO_VALIDATE">TO_VALIDATE</SelectItem>
              <SelectItem value="VALIDATED" hidden={status === 'TO_VALIDATE'}>
                VALIDATED
              </SelectItem>
              <SelectItem value="CANCELLED" hidden={status !== 'TO_CANCEL'}>
                CANCELLED
              </SelectItem>
              <SelectItem value="DONE" hidden={status === 'VALIDATED'}>
                DONE
              </SelectItem>
            </SelectContent>
          </Select>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2 animate-spin" /> Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
