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
import { sendValidationReservationMail } from '@/actions/mail';

type UpdateReservationStatusProps = {
  id: string;
  reservation: ReservationType;
};

export default function UpdateReservationStatus({ id, reservation }: UpdateReservationStatusProps) {
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
      const student = reservation.author as UserType;

      if (newStatus === 'VALIDATED') {
        const meetResponse = await fetch('/api/zoom/meet', {
          method: 'POST',
          body: JSON.stringify({
            start: reservation.startDate,
            email: student.email,
          }),
        });
        const meetJson = await meetResponse.json();
        body['meeting_link'] = meetJson['join_url'];
      }

      const result = await fetch('/api/reservations/update', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const start = reservation.startDate;
      const dateLocale = start.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timeLocale = `${start.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })} to ${reservation.endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })}`;
      const jpTime = `${start.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })} to ${reservation.endDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })}`;

      await sendValidationReservationMail(
        { email: student.email, name: student.name },
        {
          date: dateLocale,
          time: timeLocale,
          jpTime,
          meetingLink: body['meeting_link'],
        }
      );

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
  }, [id, newStatus, reservation]);

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
              <SelectItem value="TO_VALIDATE" hidden={reservation.status === 'TO_VALIDATE' || reservation.status === 'DONE'}>
                TO_VALIDATE
              </SelectItem>
              <SelectItem value="VALIDATED" hidden={reservation.status === 'VALIDATED'}>
                VALIDATED
              </SelectItem>
              <SelectItem value="CANCELLED" hidden={reservation.status !== 'TO_CANCEL'}>
                CANCELLED
              </SelectItem>
              <SelectItem value="DONE" hidden={reservation.status !== 'VALIDATED'}>
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
