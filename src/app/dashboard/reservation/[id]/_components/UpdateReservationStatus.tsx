'use client';
import { Loader } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { ReservationServiceIns } from '@/services';

type UpdateReservationStatusProps = {
  id: string;
};

export default function UpdateReservationStatus({ id }: UpdateReservationStatusProps) {
  const [newStatus, setNewStatus] = useState<StatusType>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    if (id && newStatus) {
      setLoading(true);
      ReservationServiceIns.updateOne(id, {
        status: newStatus,
        updatedAt: new Date(),
      })
        .then((data) => {
          if (!data.error) {
            toast({
              title: 'Status updated',
              description: id,
              variant: 'success',
            });
          } else {
            toast({
              description: 'Could not updated the status',
              title: 'An error occurred',
              variant: 'destructive',
            });
          }
        })
        .catch(() => {
          toast({
            description: 'Could not updated the status',
            title: 'An error occurred',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, newStatus]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-5">Update status</Button>
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
              <SelectItem value="TO_CANCEL">TO_CANCEL</SelectItem>
              <SelectItem value="VALIDATED">VALIDATED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              <SelectItem value="DONE">DONE</SelectItem>
            </SelectContent>
          </Select>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <Loader className="mr-2" /> Submitting...
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
