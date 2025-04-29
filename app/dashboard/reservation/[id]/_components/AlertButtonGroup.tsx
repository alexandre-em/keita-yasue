'use client';
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, CircleCheckBig, CircleX } from 'lucide-react';
import { redirect } from 'next/navigation';
import { sendReservationMail } from '@/actions/mail';
import { toast } from 'sonner';

type AlertButtonGroupProps = {
  reservation: ReservationType;
  user: UserType;
  id: string;
};

export default function AlertButtonGroup({ reservation, user, id }: AlertButtonGroupProps) {
  const handleSubmit = useCallback(async () => {
    if (id) {
      const result = await fetch(`/api/reservations/update`, {
        method: 'POST',
        body: JSON.stringify({
          id,
          status: 'VALIDATED',
          updatedAt: new Date().toISOString(),
        }),
      });

      if (result.status === 500) {
        toast('An error occurred', {
          description: 'Could not confirm the new time of the lesson',
          icon: <CircleX />,
        });
        return;
      }

      toast("Lesson's time updated", {
        description: id,
        icon: <CircleCheckBig />,
      });

      redirect('/dashboard');
    }
  }, [id]);

  const handleCancel = useCallback(async () => {
    if (id) {
      const newStartDate = new Date((reservation.update as ReservationHistoryType).oldStartDate);
      const newEndDate = new Date((reservation.update as ReservationHistoryType).oldEndDate);
      const body = {
        oldStartDate: reservation.startDate,
        oldEndDate: reservation.endDate,
        newStartDate,
        newEndDate,
        author: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await fetch(`/api/reservations/update/datetime/${id}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (result.status === 500) {
        toast('An error occurred', {
          description: 'Could not updated the time of the lesson',
          icon: <CircleX />,
        });
        return;
      }

      await fetch(`/api/reservations/update`, {
        method: 'POST',
        body: JSON.stringify({
          id,
          status: 'VALIDATED',
          updatedAt: new Date().toISOString(),
        }),
      });

      toast("Lesson's time updated", {
        description: id,
        icon: <CircleCheckBig />,
      });
      const dateLocale = newStartDate.toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timeLocale = `${newStartDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })} to ${newEndDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone })}`;
      const jpTime = `${newStartDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })} to ${newEndDate.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', timeZone: 'Asia/Tokyo' })}`;

      const newData = {
        date: dateLocale,
        time: timeLocale,
        jpTime,
      };

      await sendReservationMail({ email: user.email, name: user.name }, newData);

      redirect('/dashboard');
    }
  }, [id, reservation, user]);

  return (
    <div>
      <Button className="mr-2 text-green-400" variant="outline" size="icon" onClick={handleSubmit}>
        <CheckCircle />
      </Button>
      <Button className="text-red-700" variant="outline" size="icon" onClick={handleCancel}>
        <CircleX />
      </Button>
    </div>
  );
}
