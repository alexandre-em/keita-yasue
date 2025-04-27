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
import { sendMessageMail } from '@/actions/mail';
import { admin } from '@/constants/admin';
import { creditPackage } from '@/constants';

type UpdateTransactionStatusProps = {
  id: string;
  transaction: TransactionType;
  user: UserType;
};

export default function UpdateTransactionStatus({ id, transaction, user }: UpdateTransactionStatusProps) {
  const [newStatus, setNewStatus] = useState<StatusType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (id && newStatus) {
      setLoading(true);
      const body: Record<string, string> = {
        id,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      const student = transaction.user as UserType;

      const result = await fetch('/api/transactions/update', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (result.status === 500)
        toast('An error occurred', {
          description: 'Could not updated the status',
          icon: <CircleX />,
        });
      else
        toast("Review's updated", {
          description: id,
          icon: <CircleCheckBig />,
        });

      if (newStatus === 'VALIDATED') {
        await fetch('/api/users/credit', {
          method: 'POST',
          body: JSON.stringify({ id: student.id, credit: creditPackage[transaction.packageType], type: 'increase' }),
        });
        await sendMessageMail(
          {
            email: student.email,
            name: student.name,
          },
          {
            email: admin.email,
            name: admin.name,
          },
          `Your transaction has been validated.\n You can find your transaction history from the dashboard and use them to book lessons.\n Thank you for your purchase !`
        );
      }

      setLoading(false);
      setOpen(false);
    }
  }, [id, newStatus, transaction]);

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
              <SelectItem value="TO_VALIDATE" hidden={transaction.status === 'TO_VALIDATE' || transaction.status === 'DONE'}>
                TO_VALIDATE
              </SelectItem>
              <SelectItem value="VALIDATED" hidden={transaction.status === 'VALIDATED'}>
                VALIDATED
              </SelectItem>
              <SelectItem value="CANCELLED" hidden={transaction.status !== 'TO_CANCEL' && user.role === 'USER'}>
                CANCELLED
              </SelectItem>
              <SelectItem value="DONE" hidden={transaction.status !== 'VALIDATED'}>
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
