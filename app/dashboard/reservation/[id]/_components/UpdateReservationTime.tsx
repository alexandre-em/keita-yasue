'use client';
import { CircleCheckBig, CircleX } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { toast } from 'sonner';
import { sendReservationMail } from '@/actions/mail';
import { SelectDateRangeReservationDialog } from '@/app/dashboard/_components/CreateReservation';
import { redirect } from 'next/navigation';

type UpdateReservationStatusProps = {
  id: string;
  reservation: Omit<ReservationType, 'update'>;
  user: UserType;
};

export default function UpdateReservationTime({ id, reservation, user }: UpdateReservationStatusProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (newStartDate?: Date) => {
      if (id && newStartDate) {
        setLoading(true);
        const newEndDate = new Date(newStartDate);
        newEndDate.setHours(newStartDate.getHours() + 1, 0, 0, 0);
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

        setLoading(false);
        redirect('/dashboard');
      }
    },
    [id, reservation, user]
  );

  if (reservation.status === 'DONE') return null;

  return (
    <SelectDateRangeReservationDialog
      user={user}
      loading={loading}
      callback={handleSubmit}
      buttonTitle="Update time"
      type="update"
    />
  );
}
